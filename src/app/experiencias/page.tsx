"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function ExperienciasPage() {
  return (
    <div className="mx-auto max-w-4xl py-16 px-4 sm:px-8">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-7 w-7 text-sky-400" />
        <h1 className="font-heading text-3xl text-slate-100">Experiencias Tech Nova</h1>
      </div>
      <p className="mb-8 text-lg text-slate-400">
        Vive la tecnología de forma única: demos, talleres, lanzamientos y eventos exclusivos para la comunidad Nova+.
      </p>
      <div className="rounded-3xl border border-sky-500/20 bg-slate-950/70 p-8 text-center">
        <h2 className="font-heading text-2xl text-sky-300 mb-2">Próximamente</h2>
        <p className="text-slate-400">Estamos preparando nuevas experiencias y actividades para ti. Vuelve pronto para descubrir eventos y lanzamientos especiales.</p>
        <Link href="/products" className="mt-6 inline-block rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Ver catálogo completo
        </Link>
      </div>
    </div>
  );
}
