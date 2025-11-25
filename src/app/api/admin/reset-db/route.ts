import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    // Eliminar todos los usuarios existentes
    await prisma.user.deleteMany({});

    // Crear un usuario administrador por defecto
    const hashedPassword = await bcrypt.hash("admin@7139", 10);

    const adminUser = await prisma.user.create({
      data: {
        name: "Cristian",
        email: "cristivn.rc@gmail.com",
        passwordHash: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      message: "Base de datos reiniciada correctamente",
      admin: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Error al reiniciar la base de datos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
