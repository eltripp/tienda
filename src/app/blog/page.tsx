"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl py-16 px-4 sm:px-8">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-7 w-7 text-emerald-400" />
        <h1 className="font-heading text-3xl text-slate-100">Blog Tech Nova</h1>
      </div>
      <p className="mb-8 text-lg text-slate-400">
        Noticias, lanzamientos, guías y tendencias del mundo tecnológico. Inspírate y mantente actualizado con nuestro contenido exclusivo.
      </p>
      <div className="rounded-3xl border border-emerald-500/20 bg-slate-950/70 p-8 text-center">
        <h2 className="font-heading text-2xl text-emerald-300 mb-2">Próximamente</h2>
        <p className="text-slate-400">Estamos preparando artículos y novedades para ti. Vuelve pronto para descubrir el contenido más reciente.</p>
        <Link href="/products" className="mt-6 inline-block rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400">
          Ver catálogo completo
        </Link>
      </div>
    </div>
  );
}
