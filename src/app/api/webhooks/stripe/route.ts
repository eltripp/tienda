import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { PaymentStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Firma de Stripe no encontrada" },
      { status: 400 }
    );
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe no configurado" },
      { status: 500 }
    );
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (error: any) {
    console.error("Error verificando webhook de Stripe:", error.message);
    return NextResponse.json(
      { error: `Error de webhook: ${error.message}` },
      { status: 400 }
    );
  }

  // Manejar eventos específicos
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        try {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.PAID,
              status: "PROCESSING",
            },
          });

          console.log(`Pago completado para el pedido ${orderId}`);
        } catch (error) {
          console.error(`Error actualizando pedido ${orderId}:`, error);
        }
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        try {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.CANCELLED,
              status: "CANCELLED",
            },
          });

          console.log(`Sesión de pago expirada para el pedido ${orderId}`);
        } catch (error) {
          console.error(`Error actualizando pedido ${orderId}:`, error);
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        try {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.FAILED,
              status: "CANCELLED",
            },
          });

          console.log(`Pago fallido para el pedido ${orderId}`);
        } catch (error) {
          console.error(`Error actualizando pedido ${orderId}:`, error);
        }
      }
      break;
    }

    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
