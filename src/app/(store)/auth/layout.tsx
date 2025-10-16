import type { ReactNode } from "react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden lg:flex-row">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-10 text-slate-100 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.3),transparent_60%)]" />
        <div className="relative space-y-6">
          <Badge className="rounded-full border border-emerald-500/40 bg-transparent px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
            Tech Nova
          </Badge>
          <h1 className="font-heading text-4xl leading-tight">La tecnología que evoluciona contigo</h1>
          <p className="max-w-xl text-base text-slate-300">
            Controla tus pedidos, configura envíos inteligentes y desbloquea beneficios Nova+ con tu cuenta personalizada.
          </p>
        </div>
        <div className="relative grid gap-6 rounded-3xl border border-emerald-500/20 bg-slate-950/50 p-6">
          <div>
            <p className="text-sm font-semibold text-emerald-200">Entrega 24h</p>
            <p className="text-xs text-slate-400">Despachos priorizados en Región Metropolitana.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=320&q=80"
                alt="Centro de experiencia Tech Nova"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">Experiencias inmersivas</p>
              <p className="text-xs text-slate-400">Agenda demos privadas con nuestros especialistas.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex min-h-screen flex-1 items-center justify-center bg-slate-950 px-6 py-16 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_65%)]" />
        <div className="relative w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
