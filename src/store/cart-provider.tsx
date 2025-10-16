"use client";

import { useEffect, type ReactNode } from "react";

import { useCartStore, type ServerCartSummary } from "@/store/cart-store";

export function CartHydrationBoundary({ children }: { children: ReactNode }) {
  const setFromServer = useCartStore((state) => state.setFromServer);

  useEffect(() => {
    let cancelled = false;
    const loadCart = async () => {
      try {
        const response = await fetch("/api/cart", { credentials: "include" });
        if (!response.ok) return;
        const summary = (await response.json()) as ServerCartSummary;
        if (!cancelled) {
          setFromServer(summary);
        }
      } catch (error) {
        console.error("No se pudo hidratar el carrito", error);
      }
    };
    loadCart();
    return () => {
      cancelled = true;
    };
  }, [setFromServer]);

  return <>{children}</>;
}
