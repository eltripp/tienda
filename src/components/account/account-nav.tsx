"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Home, Map, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/account", label: "Resumen", icon: Home },
  { href: "/account/orders", label: "Pedidos", icon: ShoppingBag },
  { href: "/account/addresses", label: "Direcciones", icon: Map },
  { href: "/account/payments", label: "Pagos", icon: CreditCard },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-3 overflow-x-auto rounded-3xl border border-slate-900/70 bg-slate-950/60 p-3">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-4 py-2 text-sm text-slate-300 transition hover:text-emerald-200",
              active && "bg-emerald-500/10 text-emerald-200"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
