
// @ts-nocheck
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";

export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            images: true;
            brand: true;
          };
        };
      };
    };
  };
}>;

export type CartSummary = {
  id: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  items: {
    id: string;
    productId: string;
    slug: string;
    name: string;
    brand?: string | null;
    image?: string;
    quantity: number;
    price: number;
  }[];
};

export function createCartToken() {
  return randomUUID();
}

export function mapCartToSummary(cart: CartWithItems): CartSummary {
  const items = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    slug: item.product.slug,
    name: item.product.name,
    brand: item.product.brand?.name ?? null,
    image: item.product.images.find((image) => image.isPrimary)?.url ?? item.product.images[0]?.url,
    quantity: item.quantity,
    price: Number(item.unitPrice),
  }));

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return {
    id: cart.id,
    subtotal,
    shipping: Number(cart.shippingTotal ?? 0),
    discount: Number(cart.discountTotal ?? 0),
    total:
      cart.total !== null && cart.total !== undefined
        ? Number(cart.total)
        : subtotal + Number(cart.shippingTotal ?? 0) - Number(cart.discountTotal ?? 0),
    currency: cart.currency,
    items,
  };
}

export async function getCartBySession(sessionToken: string): Promise<CartWithItems | null> {
  return prisma.cart.findUnique({
    where: { sessionToken },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              brand: true,
            },
          },
        },
      },
    },
  });
}

export async function getCartByUser(userId: string): Promise<CartWithItems | null> {
  return prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              brand: true,
            },
          },
        },
      },
    },
  });
}

export async function ensureCart({
  userId,
  sessionToken,
}: {
  userId?: string;
  sessionToken?: string;
}): Promise<CartWithItems> {
  if (userId) {
    const cart = await getCartByUser(userId);
    if (cart) {
      return cart;
    }
    return prisma.cart.create({
      data: {
        userId,
        currency: "CLP",
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                brand: true,
              },
            },
          },
        },
      },
    });
  }

  const token = sessionToken ?? createCartToken();
  const cart = await getCartBySession(token);
  if (cart) {
    return cart;
  }
  return prisma.cart.create({
    data: {
      sessionToken: token,
      currency: "CLP",
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              brand: true,
            },
          },
        },
      },
    },
  });
}

export async function upsertCartItem({
  cartId,
  productId,
  quantity,
}: {
  cartId: string;
  productId: string;
  quantity: number;
}) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error("Producto no encontrado");
  }

  const unitPrice = product.price;

  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId,
        productId,
      },
    },
    update: {
      quantity,
      unitPrice,
    },
    create: {
      cartId,
      productId,
      quantity,
      unitPrice,
    },
  });

  await prisma.cart.update({
    where: { id: cartId },
    data: {
      updatedAt: new Date(),
    },
  });

  return refreshCartTotals(cartId);
}

export async function removeCartItem({ cartId, productId }: { cartId: string; productId: string }) {
  await prisma.cartItem.delete({
    where: {
      cartId_productId: {
        cartId,
        productId,
      },
    },
  });

  return refreshCartTotals(cartId);
}

function calculateCartTotals(cart: CartWithItems) {
  const subtotal = cart.items.reduce((total, item) => {
    return total + Number(item.unitPrice) * item.quantity;
  }, 0);

  const shipping = Number(cart.shippingTotal ?? 0);
  const discount = Number(cart.discountTotal ?? 0);
  const total = subtotal + shipping - discount;

  return { subtotal, shipping, discount, total };
}

export async function refreshCartTotals(cartId: string): Promise<CartWithItems | null> {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              brand: true,
            },
          },
        },
      },
    },
  });

  if (!cart) return null;

  const totals = calculateCartTotals(cart as CartWithItems);

  const updated = await prisma.cart.update({
    where: { id: cartId },
    data: {
      // Prisma Decimal fields can be set from JS numbers directly.
      subtotal: totals.subtotal,
      shippingTotal: totals.shipping,
      discountTotal: totals.discount,
      total: totals.total,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              brand: true,
            },
          },
        },
      },
    },
  });

  return updated;
}
