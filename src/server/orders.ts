// @ts-nocheck
import { Prisma } from "@prisma/client";
import { OrderStatus, PaymentStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { CartWithItems } from "@/server/cart";

export type CheckoutContact = {
  name: string;
  email: string;
  phone: string;
};

export type CheckoutAddress = {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  notes?: string;
};

export async function createOrderFromCart({
  cart,
  userId,
  contact,
  address,
  shippingCost,
  discountTotal,
  total,
  paymentIntentId,
  paymentStatus = PaymentStatus.PENDING,
}: {
  cart: CartWithItems;
  userId?: string;
  contact: CheckoutContact;
  address: CheckoutAddress;
  shippingCost: number;
  discountTotal: number;
  total: number;
  paymentIntentId?: string | null;
  paymentStatus?: PaymentStatus;
}) {
  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
  const orderNumber = Math.floor(Date.now() / 1000);

  const contactNotes = `Contacto: ${contact.name} - ${contact.email} - ${contact.phone}`;
  const mergedNotes = address.notes ? `${address.notes}\n${contactNotes}` : contactNotes;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: userId ?? null,
      status: OrderStatus.PROCESSING,
      paymentStatus,
  // Set numeric values directly; Prisma will convert to Decimal for Decimal fields.
  subtotal: subtotal,
  shippingTotal: shippingCost,
  discountTotal: discountTotal,
  total: total,
      notes: mergedNotes,
      paymentIntentId: paymentIntentId ?? null,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cart.update({
    where: { id: cart.id },
    data: {
      subtotal: 0,
      shippingTotal: 0,
      discountTotal: 0,
      total: 0,
    },
  });

  return order;
}
