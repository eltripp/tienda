import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function CheckoutSuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  const orderId = searchParams.order ?? "";

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
        <CheckCircle2 className="h-12 w-12" />
        <Sparkles className="absolute -bottom-2 -right-2 h-6 w-6 text-sky-400" />
      </div>
      <h1 className="font-heading text-3xl text-slate-100 sm:text-4xl">Pedido confirmado</h1>
      <p className="max-w-xl text-sm text-slate-400">
        Gracias por confiar en Tech Nova. Te enviaremos un correo con el seguimiento y detalles del despacho.
      </p>
      {orderId && (
        <p className="text-sm text-emerald-300">Codigo de pedido: {orderId}</p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/products"
          className="rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-400/40 hover:text-emerald-200"
        >
          Seguir explorando
        </Link>
        <Link
          href="/account/orders"
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
        >
          Ver mis pedidos
        </Link>
      </div>
    </main>
  );
}
