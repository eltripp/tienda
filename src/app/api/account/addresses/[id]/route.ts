import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { street, city, state, postalCode, country, isDefault, fullName, phone } = body;

    if (!street || !city || !postalCode || !country || !fullName) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Verificar que la dirección pertenece al usuario
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 });
    }

    // Si la dirección se marca como predeterminada, desmarcar todas las demás
    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: session.user.id,
          id: { not: params.id }
        },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: params.id },
      data: {
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error al actualizar dirección:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que la dirección pertenece al usuario
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 });
    }

    // Si la dirección a eliminar es la predeterminada, establecer la primera dirección restante como predeterminada
    if (existingAddress.isDefault) {
      const remainingAddresses = await prisma.address.findMany({
        where: {
          userId: session.user.id,
          id: { not: params.id },
        },
        orderBy: { createdAt: "asc" },
      });

      if (remainingAddresses.length > 0) {
        await prisma.address.update({
          where: { id: remainingAddresses[0].id },
          data: { isDefault: true },
        });
      }
    }

    await prisma.address.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Dirección eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar dirección:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
