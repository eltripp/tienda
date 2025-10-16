"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";

import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export function CartPageContent() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const shipping = useCartStore((state) => state.shipping);
  const discount = useCartStore((state) => state.discount);
  const total = useCartStore((state) => state.total);
  const currency = useCartStore((state) => state.currency);
  const removeProduct = useCartStore((state) => state.removeProduct);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-16 sm:px-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Carrito de compra</p>
          <h1 className="font-heading text-3xl text-slate-100 sm:text-4xl">Revisa tu seleccion</h1>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
        >
          <ArrowLeft className="h-4 w-4" /> Seguir comprando
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-12 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-emerald-400" />
          <h2 className="mt-6 font-heading text-2xl text-slate-100">Tu carrito esta vacio</h2>
          <p className="mt-2 text-sm text-slate-400">
            Explora nuestro catalogo de tecnologia premium y agrega lo que se adapte a tu rutina.
          </p>
          <Button asChild className="mt-6 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400">
            <Link href="/products">Explorar catalogo</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="flex gap-4 rounded-3xl border border-slate-900/70 bg-slate-950/60 p-4"
              >
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-slate-900">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xs text-slate-500">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg text-slate-100">{item.name}</h3>
                    {item.brand && (
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">{item.brand}</p>
                    )}
                    <p className="mt-2 text-sm text-slate-400">{formatCurrency(item.price, currency)}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Cantidad: {item.quantity}</span>
                    <button
                      type="button"
                      className="rounded-full px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-900 hover:text-rose-400"
                      onClick={() => removeProduct(item.productId)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="space-y-4 rounded-3xl border border-emerald-500/20 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">Resumen</p>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Envio estimado</span>
                <span>{shipping > 0 ? formatCurrency(shipping, currency) : "Por calcular"}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-300">
                <span>Descuento</span>
                <span>
                  {discount > 0 ? `- ${formatCurrency(discount, currency)}` : "Aplicado en checkout"}
                </span>
              </div>
              <Separator className="border-slate-900/60" />
              <div className="flex items-center justify-between text-base font-semibold text-slate-100">
                <span>Total</span>
                <span>{formatCurrency(total, currency)}</span>
              </div>
            </div>
            <Button
              className="w-full rounded-xl bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
              asChild
            >
              <Link href="/checkout">
                Proceder al checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl border-slate-800 text-slate-200 hover:border-emerald-400/40 hover:text-emerald-200"
              asChild
            >
              <Link href="/products">Seguir comprando</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
