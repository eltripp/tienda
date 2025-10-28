"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  brand?: string | null;
  maxQuantity?: number;
};

export type ServerCartSummary = {
  id: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  items: Array<{
    id: string;
    productId: string;
    slug: string;
    name: string;
    brand?: string | null;
    image?: string;
    quantity: number;
    price: number;
  }>;
};

type CartState = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  sessionId?: string;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  hydrate: (payload: Partial<CartState>) => void;
  setFromServer: (summary: ServerCartSummary) => void;
  addProduct: (productId: string, quantity?: number) => Promise<void>;
  updateProduct: (productId: string, quantity: number) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  clear: () => void;
};

function mapServerSummary(summary: ServerCartSummary) {
  return {
    items: summary.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      brand: item.brand ?? null,
    })),
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    discount: summary.discount,
    total: summary.total,
    currency: summary.currency,
    sessionId: summary.id,
  } satisfies Partial<CartState>;
}

async function requestCart(endpoint: string, options?: RequestInit, retries = 2): Promise<ServerCartSummary> {
  const makeRequest = async (attempt: number): Promise<ServerCartSummary> => {
    try {
      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        ...options,
      });
      
      if (!response.ok) {
        const errorMessage = await response.text().catch(() => "Error desconocido");
        throw new Error(`Cart API error ${response.status}: ${errorMessage}`);
      }
      
      const data = await response.json() as ServerCartSummary;
      return data;
    } catch (error) {
      console.error(`Cart request attempt ${attempt + 1} failed:`, error);
      
      if (attempt < retries) {
        // Esperar un tiempo exponencial antes de reintentar
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return makeRequest(attempt + 1);
      }
      
      throw error;
    }
  };
  
  return makeRequest(0);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      currency: "CLP",
      sessionId: undefined,
      drawerOpen: false,
      setDrawerOpen: (open) => set({ drawerOpen: open }),
      hydrate: (payload) =>
        set((state) => ({
          ...state,
          ...payload,
        })),
      setFromServer: (summary) =>
        set((state) => ({
          ...state,
          ...mapServerSummary(summary),
        })),
      addProduct: async (productId, quantity = 1) => {
        const summary = await requestCart("/api/cart", {
          method: "POST",
          body: JSON.stringify({ productId, quantity }),
        });
        get().setFromServer(summary);
        set({ drawerOpen: true });
      },
      updateProduct: async (productId, quantity) => {
        const summary = await requestCart("/api/cart", {
          method: "PATCH",
          body: JSON.stringify({ productId, quantity }),
        });
        get().setFromServer(summary);
      },
      removeProduct: async (productId) => {
        const summary = await requestCart("/api/cart", {
          method: "DELETE",
          body: JSON.stringify({ productId }),
        });
        get().setFromServer(summary);
      },
      clear: () =>
        set((state) => ({
          ...state,
          items: [],
          subtotal: 0,
          shipping: 0,
          discount: 0,
          total: 0,
        })),
    }),
    {
      name: "technova-cart",
      version: 1,
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        shipping: state.shipping,
        discount: state.discount,
        total: state.total,
        currency: state.currency,
        sessionId: state.sessionId,
      }),
    },
  ),
);
