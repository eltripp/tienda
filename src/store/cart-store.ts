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
        // Verificar si el producto es de localStorage
        if (productId.startsWith("ls-")) {
          try {
            // Obtener el producto completo de localStorage
            const { getLocalStorageProducts } = await import("@/lib/localStorageProducts");
            const adminProducts = getLocalStorageProducts();
            const fullProduct = adminProducts.find(p => p.id === productId);
            
            if (fullProduct) {
              // Obtener el estado actual del carrito
              const state = get();
              const existingItem = state.items.find(item => item.productId === productId);
              
              // Crear o actualizar el item del carrito
              const cartItem: CartItem = {
                id: existingItem?.id || `cart-${productId}-${Date.now()}`,
                productId: productId,
                slug: fullProduct.slug,
                name: fullProduct.name,
                price: fullProduct.price,
                image: fullProduct.images?.[0]?.url || "",
                quantity: existingItem ? existingItem.quantity + quantity : quantity,
                brand: typeof fullProduct.brand === "string" ? fullProduct.brand : fullProduct.brand?.name,
                maxQuantity: fullProduct.stock,
              };
              
              // Actualizar el carrito
              const newItems = existingItem
                ? state.items.map(item => item.productId === productId ? cartItem : item)
                : [...state.items, cartItem];
              
              // Calcular nuevos totales
              const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const shipping = 0; // Envío gratis para productos de localStorage
              const discount = 0;
              const total = subtotal + shipping - discount;
              
              // Actualizar el estado
              set({
                items: newItems,
                subtotal,
                shipping,
                discount,
                total,
                currency: "CLP",
                drawerOpen: true,
              });
              
              return;
            }
          } catch (error) {
            console.error("Error al agregar producto de localStorage al carrito:", error);
          }
        }
        
        // Si es un producto de la base de datos, usar el método normal
        const summary = await requestCart("/api/cart", {
          method: "POST",
          body: JSON.stringify({ productId, quantity }),
        });
        get().setFromServer(summary);
        set({ drawerOpen: true });
      },
      updateProduct: async (productId, quantity) => {
        // Verificar si el producto es de localStorage
        if (productId.startsWith("ls-")) {
          try {
            // Obtener el estado actual del carrito
            const state = get();
            const existingItem = state.items.find(item => item.productId === productId);
            
            if (existingItem) {
              // Actualizar la cantidad del item
              const newItems = state.items.map(item => 
                item.productId === productId 
                  ? { ...item, quantity }
                  : item
              );
              
              // Calcular nuevos totales
              const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const shipping = 0; // Envío gratis para productos de localStorage
              const discount = 0;
              const total = subtotal + shipping - discount;
              
              // Actualizar el estado
              set({
                items: newItems,
                subtotal,
                shipping,
                discount,
                total,
                currency: "CLP",
              });
              
              return;
            }
          } catch (error) {
            console.error("Error al actualizar producto de localStorage en el carrito:", error);
          }
        }
        
        // Si es un producto de la base de datos, usar el método normal
        const summary = await requestCart("/api/cart", {
          method: "PATCH",
          body: JSON.stringify({ productId, quantity }),
        });
        get().setFromServer(summary);
      },
      removeProduct: async (productId) => {
        // Verificar si el producto es de localStorage
        if (productId.startsWith("ls-")) {
          try {
            // Obtener el estado actual del carrito
            const state = get();
            
            // Filtrar los items para eliminar el producto
            const newItems = state.items.filter(item => item.productId !== productId);
            
            // Calcular nuevos totales
            const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = 0; // Envío gratis para productos de localStorage
            const discount = 0;
            const total = subtotal + shipping - discount;
            
            // Actualizar el estado
            set({
              items: newItems,
              subtotal,
              shipping,
              discount,
              total,
              currency: "CLP",
            });
            
            return;
          } catch (error) {
            console.error("Error al eliminar producto de localStorage del carrito:", error);
          }
        }
        
        // Si es un producto de la base de datos, usar el método normal
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
