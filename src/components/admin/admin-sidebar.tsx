"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  Home,
  LogOut,
  PackageOpen,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { label: "Panel", icon: Home, href: "/admin" },
  { label: "Productos", icon: Boxes, href: "/admin/products" },
  { label: "Pedidos", icon: PackageOpen, href: "/admin/orders" },
  { label: "Clientes", icon: Users, href: "/admin/customers" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-shrink-0 border-r border-slate-900/80 bg-slate-950/80 p-6 lg:flex lg:flex-col">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 via-sky-500 to-blue-600 text-lg font-bold text-slate-900 shadow-lg shadow-emerald-500/20">
          TN
        </span>
        <div>
          <p className="font-heading text-lg">Tech Nova</p>
          <p className="text-xs text-slate-500">Console</p>
        </div>
      </div>
      <nav className="mt-10 flex-1 space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-emerald-500/30 hover:bg-slate-900",
                active && "border-emerald-500/50 bg-emerald-500/10 text-emerald-200",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 rounded-2xl border border-slate-900/70 bg-slate-900/60 p-4 text-xs text-slate-400">
        <p className="font-semibold text-slate-200">Resumen semanal</p>
        <p>12 pedidos pendientes • 4 tickets críticos</p>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 text-emerald-300 transition hover:text-emerald-200"
        >
          <Settings className="h-3 w-3" /> Ajustes
        </Link>
      </div>
      <button className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-900/70 bg-slate-900/60 px-4 py-2 text-sm text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-200">
        <LogOut className="h-4 w-4" /> Cerrar sesión
      </button>
    </aside>
  );
}
