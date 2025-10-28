"use client";

import { useEffect, type ReactNode } from "react";

import { useCartStore, type ServerCartSummary } from "@/store/cart-store";

export function CartHydrationBoundary({ children }: { children: ReactNode }) {
  const setFromServer = useCartStore((state) => state.setFromServer);

  useEffect(() => {
    let cancelled = false;
    let retryCount = 0;
    const maxRetries = 2;
    
    const loadCart = async (attempt = 0) => {
      try {
        const response = await fetch("/api/cart", { credentials: "include" });
        
        if (!response.ok) {
          const errorMessage = await response.text().catch(() => "Error desconocido");
          console.error(`Error al cargar carrito (intento ${attempt + 1}):`, response.status, errorMessage);
          
          if (attempt < maxRetries && !cancelled) {
            // Esperar un tiempo exponencial antes de reintentar
            const delay = Math.pow(2, attempt) * 1000;
            setTimeout(() => loadCart(attempt + 1), delay);
            return;
          }
          
          return;
        }
        
        const summary = (await response.json()) as ServerCartSummary;
        
        if (!cancelled) {
          setFromServer(summary);
        }
      } catch (error) {
        console.error(`No se pudo hidratar el carrito (intento ${attempt + 1}):`, error);
        
        if (attempt < maxRetries && !cancelled) {
          // Esperar un tiempo exponencial antes de reintentar
          const delay = Math.pow(2, attempt) * 1000;
          setTimeout(() => loadCart(attempt + 1), delay);
        }
      }
    };
    
    loadCart();
    
    return () => {
      cancelled = true;
    };
  }, [setFromServer]);

  return <>{children}</>;
}
