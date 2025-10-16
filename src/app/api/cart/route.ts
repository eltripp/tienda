// src/app/api/cart/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

import { getServerSession } from "next-auth/next"; // ✅ para NextAuth v4
import { authOptions } from "@/server/auth"; // ✅ importas la configuración

import type { CartWithItems } from "@/server/cart";
import {
  ensureCart,
  mapCartToSummary,
  removeCartItem,
  upsertCartItem,
  refreshCartTotals,
} from "@/server/cart";

const CART_COOKIE = "tn_cart";
const CART_MAX_AGE = 60 * 60 * 24 * 30;

async function resolveCart(req: NextRequest) {
  const session = await getServerSession(authOptions); // ✅ obtiene la sesión
  const cartToken = req.cookies.get(CART_COOKIE)?.value;

  const cart = await ensureCart({
    userId: session?.user?.id,
    sessionToken: cartToken,
  });

  return { cart, session, cartToken };
}

async function persistCartCookie(token?: string) {
  if (!token) return;
  const c = await cookies();
  c.set(CART_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: CART_MAX_AGE,
  });
}

export async function GET(req: NextRequest) {
  const { cart } = await resolveCart(req);
  await persistCartCookie(cart.sessionToken ?? undefined);
  const refreshed = await refreshCartTotals(cart.id);
  const activeCart: CartWithItems = (refreshed ?? cart) as CartWithItems;
  const summary = mapCartToSummary(activeCart);
  return NextResponse.json(summary);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, quantity } = body as { productId?: string; quantity?: number };

  if (!productId || !quantity || quantity < 1) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { cart } = await resolveCart(req);
  await persistCartCookie(cart.sessionToken ?? undefined);
  const updated = await upsertCartItem({ cartId: cart.id, productId, quantity });
  if (!updated) {
    return NextResponse.json({ error: "No se pudo actualizar el carrito" }, { status: 500 });
  }
  const summary = mapCartToSummary(updated);
  return NextResponse.json(summary, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { productId, quantity } = body as { productId?: string; quantity?: number };

  if (!productId || quantity === undefined) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { cart } = await resolveCart(req);
  await persistCartCookie(cart.sessionToken ?? undefined);

  if (quantity <= 0) {
    const updated = await removeCartItem({ cartId: cart.id, productId });
    if (!updated) {
      return NextResponse.json({ error: "Carrito no encontrado" }, { status: 404 });
    }
    const summary = mapCartToSummary(updated);
    return NextResponse.json(summary);
  }

  const updated = await upsertCartItem({ cartId: cart.id, productId, quantity });
  if (!updated) {
    return NextResponse.json({ error: "No se pudo actualizar el carrito" }, { status: 500 });
  }
  const summary = mapCartToSummary(updated);
  return NextResponse.json(summary);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { productId } = body as { productId?: string };
  if (!productId) {
    return NextResponse.json({ error: "Producto requerido" }, { status: 400 });
  }

  const { cart } = await resolveCart(req);
  await persistCartCookie(cart.sessionToken ?? undefined);
  const updated = await removeCartItem({ cartId: cart.id, productId });
  if (!updated) {
    return NextResponse.json({ error: "Carrito no encontrado" }, { status: 404 });
  }
  const summary = mapCartToSummary(updated);
  return NextResponse.json(summary);
}
