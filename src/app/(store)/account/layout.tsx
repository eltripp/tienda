import type { ReactNode } from "react";

import { AccountNav } from "@/components/account/account-nav";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16 sm:px-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tu espacio</p>
        <h1 className="font-heading text-3xl text-slate-100">Cuenta Tech Nova</h1>
        <p className="text-sm text-slate-400">
          Gestiona envíos, suscripciones y beneficios Nova+ desde un solo lugar.
        </p>
      </div>
      <AccountNav />
      {children}
    </div>
  );
}
