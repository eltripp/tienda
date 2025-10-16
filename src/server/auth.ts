// @ts-nocheck
// src/server/auth.ts
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const emailConfigured = Boolean(
  env.EMAIL_SERVER_HOST &&
    env.EMAIL_SERVER_USER &&
    env.EMAIL_SERVER_PASSWORD &&
    env.EMAIL_FROM,
);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    EmailProvider({
      name: "Magic Link",
      from: env.EMAIL_FROM ?? "Tech Nova <noreply@technova.dev>",
      server: emailConfigured
        ? {
            host: env.EMAIL_SERVER_HOST,
            port: env.EMAIL_SERVER_PORT ?? 587,
            auth: {
              user: env.EMAIL_SERVER_USER,
              pass: env.EMAIL_SERVER_PASSWORD,
            },
          }
        : undefined,
      sendVerificationRequest: async ({ identifier, url }) => {
        if (!emailConfigured) {
          console.info(`Magic link para ${identifier}: ${url}`);
          return;
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Correo y contraseña",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          addresses: user.name
            ? {
                create: {
                  label: "Principal",
                  fullName: user.name,
                  street: "Completa tu dirección",
                  city: "",
                  postalCode: "",
                  country: "CL",
                },
              }
            : undefined,
        },
      });
    },
  },
};

// 👇 Este handler se usa por NextAuth en las rutas de API
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
