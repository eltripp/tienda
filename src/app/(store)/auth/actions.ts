"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerUser(input: z.infer<typeof registerSchema>) {
  const values = registerSchema.parse(input);

  const existing = await prisma.user.findUnique({
    where: { email: values.email },
  });

  if (existing) {
    throw new Error("El correo ya está registrado.");
  }

  const passwordHash = await bcrypt.hash(values.password, 12);

  await prisma.user.create({
    data: {
      name: values.name,
      email: values.email,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  revalidatePath("/account");
}
