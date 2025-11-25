import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.string().min(1),
  stock: z.number().int().nonnegative(),
  image: z.string().url().optional(),
  weight: z.number().positive().optional(),
  featured: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const limit = Number(searchParams.get("limit")) || 20;
  const page = Number(searchParams.get("page")) || 1;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (category) {
    where.category = category;
  }
  if (featured === "true") {
    where.featured = true;
  }

  try {
    const products = await prisma.product.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener los productos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.create({
      data: parsed.data,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
