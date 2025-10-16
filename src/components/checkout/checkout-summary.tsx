"use client";

import Image from "next/image";

import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

export function CheckoutSummary() {
  const { items, subtotal, shipping, discount, total, currency } = useCartStore();

  return (
    <div className="space-y-4 rounded-3xl border border-emerald-500/20 bg-slate-950/70 p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">Resumen del pedido</p>
        <p className="text-sm text-slate-400">{items.length} producto(s)</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-900">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-xs text-slate-500">Sin imagen</div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-200">{item.name}</p>
              <p className="text-xs text-slate-500">Cantidad: {item.quantity}</p>
            </div>
            <span className="text-sm text-slate-300">{formatCurrency(item.price * item.quantity, currency)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2 text-sm text-slate-300">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal, currency)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Envio estimado</span>
          <span>{shipping > 0 ? formatCurrency(shipping, currency) : "Se calcula al confirmar"}</span>
        </div>
        <div className="flex items-center justify-between text-emerald-300">
          <span>Descuento</span>
          <span>{discount > 0 ? `- ${formatCurrency(discount, currency)}` : "Pendiente"}</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-base font-semibold text-slate-100">
          <span>Total estimado</span>
          <span>{formatCurrency(total > 0 ? total : subtotal, currency)}</span>
        </div>
      </div>
    </div>
  );
}
