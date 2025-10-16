// src/auth.ts
import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
