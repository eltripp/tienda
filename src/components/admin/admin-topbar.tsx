"use client";

import Image from "next/image";
import { Bell, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminTopbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-900/80 bg-slate-950/80 px-6 py-4">
      <div className="relative hidden max-w-sm flex-1 items-center gap-3 rounded-xl border border-slate-900 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 sm:flex">
        <Search className="h-4 w-4 text-slate-500" />
        <Input
          placeholder="Buscar pedidos, clientes o productos"
          className="border-0 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus-visible:ring-0"
        />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full border border-slate-900/70 bg-slate-900/60 text-slate-200 hover:border-emerald-400/40 hover:text-emerald-200"
        >
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-100">Sara Méndez</p>
            <p className="text-xs text-slate-500">Administradora</p>
          </div>
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-emerald-500/30">
            <Image
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
