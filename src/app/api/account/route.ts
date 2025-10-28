import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/lib/prisma";
// Configurar los headers CORS para la API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function GET(request: Request) {
  // Añadir logging para depuración
  console.log("API Request headers:", Object.fromEntries(request.headers.entries()));
  
  const session = await getServerSession(authOptions);
  console.log("Session:", session);
  if (!session?.user?.id) {
    console.error("API Error: Sesión no encontrada o inválida");
    return new NextResponse(
      JSON.stringify({ error: "No autorizado", details: "Sesión no encontrada o inválida" }),
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: true,
      orders: {
        include: {
          items: { include: { product: true } },
        },
      },
      paymentMethods: true,
    },
  });

  if (!user) {
    return new NextResponse(
      JSON.stringify({ error: "Usuario no encontrado" }),
      { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }

  // Do not send passwordHash
  const { passwordHash, ...safeUser } = user;

  return new NextResponse(
    JSON.stringify(safeUser),
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    }
  );
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
