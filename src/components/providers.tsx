"use client";

import { type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

import { CartHydrationBoundary } from "@/store/cart-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <TooltipProvider delayDuration={150}>
        <CartHydrationBoundary>{children}</CartHydrationBoundary>
      </TooltipProvider>
    </SessionProvider>
  );
}
