import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { auth } from "@/server/auth";
import { ensureCart, mapCartToSummary, refreshCartTotals, type CartWithItems } from "@/server/cart";
import { estimateShipping } from "@/lib/shipping";
import { env } from "@/lib/env";
import { createOrderFromCart } from "@/server/orders";
import { stripe } from "@/lib/stripe";
import { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  contact: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(8),
  }),
  shipping: z.object({
    street: z.string().min(3),
    city: z.string().min(2),
    region: z.string().min(2),
    postalCode: z.string().min(4),
    notes: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const session = await auth();
  const cart = await ensureCart({
    userId: session?.user?.id,
    sessionToken: req.cookies.get("tn_cart")?.value,
  });

  const refreshed = await refreshCartTotals(cart.id);
  const activeCart: CartWithItems = (refreshed ?? cart) as CartWithItems;
  const summary = mapCartToSummary(activeCart);

  if (summary.items.length === 0) {
    return NextResponse.json({ error: "El carrito esta vacio" }, { status: 400 });
  }

  const totalWeight = activeCart.items.reduce((sum, item) => {
    const weight = Number(item.product.weight ?? 1);
    return sum + weight * item.quantity;
  }, 0);

  const shippingQuote = estimateShipping(parsed.data.shipping.region, summary.subtotal, totalWeight);
  const orderTotal = summary.subtotal + shippingQuote.cost - summary.discount;

  const order = await createOrderFromCart({
    cart: activeCart,
    userId: session?.user?.id,
    contact: parsed.data.contact,
    address: parsed.data.shipping,
    shippingCost: shippingQuote.cost,
    discountTotal: summary.discount,
    total: orderTotal,
    paymentStatus: stripe ? PaymentStatus.PENDING : PaymentStatus.PAID,
  });

  if (stripe) {
    const lineItems = summary.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: summary.currency.toLowerCase(),
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
    }));

    lineItems.push({
      quantity: 1,
      price_data: {
        currency: summary.currency.toLowerCase(),
        product_data: {
          name: "Envio",
        },
        unit_amount: Math.round(shippingQuote.cost * 100),
      },
    });

    const sessionResponse = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.contact.email,
      success_url: `${env.NEXTAUTH_URL ?? "http://localhost:3000"}/checkout/success?order=${order.id}`,
      cancel_url: `${env.NEXTAUTH_URL ?? "http://localhost:3000"}/checkout`,
      line_items: lineItems,
      metadata: {
        orderId: order.id,
      },
    });

    if (sessionResponse.payment_intent) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentIntentId: String(sessionResponse.payment_intent),
        },
      });
    }

    return NextResponse.json({ checkoutUrl: sessionResponse.url, orderId: order.id });
  }

  return NextResponse.json({ success: true, orderId: order.id, shipping: shippingQuote });
}
