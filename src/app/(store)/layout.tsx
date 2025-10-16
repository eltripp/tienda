import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CartDrawer } from "@/components/cart/cart-drawer";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-sky-500/5 via-emerald-500/5 to-transparent blur-3xl" />
      <Navbar />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
