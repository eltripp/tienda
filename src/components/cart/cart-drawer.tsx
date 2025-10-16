"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/common/scroll-area";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  // select primitives individually to avoid returning a new object from the selector
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const shipping = useCartStore((state) => state.shipping);
  const discount = useCartStore((state) => state.discount);
  const total = useCartStore((state) => state.total);
  const currency = useCartStore((state) => state.currency);
  const drawerOpen = useCartStore((state) => state.drawerOpen);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const removeProduct = useCartStore((state) => state.removeProduct);

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-slate-950 p-0 sm:max-w-lg">
        <SheetHeader className="px-6 pb-6 pt-8">
          <SheetTitle className="text-left font-heading text-2xl text-slate-50">
            Tu carrito
          </SheetTitle>
          <p className="text-left text-sm text-slate-400">
            Revisa los productos agregados antes de continuar con la compra.
          </p>
        </SheetHeader>
        <Separator className="border-slate-800" />

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-4 px-4 py-6">
            <AnimatePresence initial={false}>
              {items.length === 0 && (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl border border-dashed border-slate-800 bg-slate-900/60 p-6 text-center"
                >
                  <p className="font-heading text-lg text-slate-200">No hay productos aun</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Explora las ultimas novedades y agrega tus favoritos.
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-4 bg-slate-800 text-slate-200 hover:bg-slate-700"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Descubrir productos
                  </Button>
                </motion.div>
              )}

              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex gap-4 rounded-2xl border border-slate-900/80 bg-slate-900/50 p-4 transition hover:border-emerald-500/40 hover:bg-slate-900"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-800">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800/80 text-sm text-slate-400">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-heading text-base text-slate-100 transition hover:text-emerald-400"
                        onClick={() => setDrawerOpen(false)}
                      >
                        {item.name}
                      </Link>
                      {item.brand && (
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">{item.brand}</p>
                      )}
                      <p className="mt-1 text-sm text-slate-400">
                        {formatCurrency(item.price, currency)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Cantidad: {item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => removeProduct(item.productId)}
                        className="rounded-full px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-800 hover:text-rose-400"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <Separator className="border-slate-800" />

        <SheetFooter className="px-6 py-8">
          <div className="w-full space-y-4">
            <div className="space-y-2 rounded-2xl border border-slate-900/70 bg-slate-900/70 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Envio estimado</span>
                <span>{shipping > 0 ? formatCurrency(shipping, currency) : "Por calcular"}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span>Descuento</span>
                <span>
                  {discount > 0 ? `- ${formatCurrency(discount, currency)}` : "Aplicado en checkout"}
                </span>
              </div>
              <Separator className="border-slate-800/60" />
              <div className="flex items-center justify-between text-base font-semibold text-slate-100">
                <span>Total</span>
                <span>{formatCurrency(total, currency)}</span>
              </div>
            </div>
            <Button
              className="w-full rounded-xl bg-emerald-500 text-emerald-950 transition hover:bg-emerald-400 hover:text-emerald-900"
              size="lg"
              disabled={items.length === 0}
              asChild
            >
              <Link href="/checkout" onClick={() => setDrawerOpen(false)}>
                Finalizar compra
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full rounded-xl border border-slate-800 bg-transparent text-slate-200 hover:border-slate-700 hover:bg-slate-900"
              onClick={() => setDrawerOpen(false)}
            >
              Seguir explorando
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
