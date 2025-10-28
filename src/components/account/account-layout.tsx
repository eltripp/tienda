"use client";

import { ReactNode } from "react";
import { AccountNav } from "@/components/account/account-nav";
import { User } from "lucide-react";

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
  icon?: ReactNode;
  subtitle?: string;
}

export function AccountLayout({ children, title, icon, subtitle }: AccountLayoutProps) {
  return (
    <div className="rounded-3xl border border-slate-900/70 bg-slate-950/60 p-6 sm:p-10 space-y-6">
      <div className="flex items-center gap-3">
        {icon || <User className="h-5 w-5 text-emerald-400" />}
        <div>
          <h1 className="font-heading text-2xl text-slate-100">{title}</h1>
          {subtitle && <p className="text-slate-400">{subtitle}</p>}
        </div>
      </div>

      {children}
    </div>
  );
}
