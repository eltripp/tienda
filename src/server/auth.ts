
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
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
    updateAge: 24 * 60 * 60, // 24 horas
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 días
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === "production" ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
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
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user id to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.role = user.role;
      }
      console.log("JWT callback:", token);
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from the token
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      console.log("Session callback:", session);
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Si la URL es relativa, prefijarla con el baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Si la URL es relativa al baseUrl actual, permitir
      else if (new URL(url).origin === baseUrl) return url;
      // Por defecto, redirigir al dashboard del cliente
      return baseUrl + "/account";
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
