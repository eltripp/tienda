import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const card = await prisma.paymentMethod.create({
    data: {
      userId: session.user.id,
      brand: body.brand,
      last4: body.last4,
      expMonth: body.expMonth,
      expYear: body.expYear,
    },
  });
  return NextResponse.json(card);
}
