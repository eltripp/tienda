import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Obtener todos los usuarios de la base de datos
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transformar los datos para que coincidan con el formato esperado
    const customers = users.map(user => ({
      id: user.id,
      name: user.name || "Sin nombre",
      email: user.email,
      phone: "", // No tenemos teléfono en el modelo de usuario
      avatar: `https://avatar.vercel.sh/${user.email}`,
      joinDate: user.createdAt.toISOString().split('T')[0],
      lastOrder: user.orders.length > 0 
        ? user.orders[0].id 
        : "Sin pedidos",
      totalOrders: user.orders.length,
      totalSpent: user.orders.reduce((sum, order) => sum + order.total, 0),
      status: user.role === "ADMIN" ? "admin" : "active",
      role: user.role,
    }));

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
