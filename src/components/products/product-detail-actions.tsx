"use client";

import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export function ProductDetailActions({ productId, slug }: { productId: string; slug: string }) {
  const [loading, setLoading] = useState(false);
  const addProduct = useCartStore((state) => state.addProduct);

  const handleAdd = async () => {
    setLoading(true);
    try {
      // Verificar si el producto es de localStorage
      if (productId.startsWith("ls-")) {
        // Obtener el producto completo de localStorage
        const { getLocalStorageProducts } = await import("@/lib/localStorageProducts");
        const adminProducts = getLocalStorageProducts();
        const fullProduct = adminProducts.find(p => p.id === productId);
        
        if (fullProduct) {
          // Agregar el producto de localStorage al carrito
          const cartProduct = {
            id: productId,
            name: fullProduct.name,
            price: fullProduct.price,
            image: fullProduct.images?.[0]?.url || "",
            quantity: 1,
            slug: slug,
          };
          
          // Guardar en el carrito de localStorage
          const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
          const existingItemIndex = cartItems.findIndex((item: any) => item.id === productId);
          
          if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += 1;
          } else {
            cartItems.push(cartProduct);
          }
          
          localStorage.setItem("cart", JSON.stringify(cartItems));
          
          // Actualizar el estado del carrito
          useCartStore.setState({ items: cartItems });
          return;
        }
      }
      
      // Si es un producto de la base de datos, usar el método normal
      await addProduct(productId, 1);
    } catch (error) {
      console.error("No se pudo agregar el producto", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        className="flex-1 rounded-xl bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
        onClick={handleAdd}
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
        Agregar al carrito
      </Button>
      <Button
        variant="outline"
        className="flex-1 rounded-xl border-slate-800 text-slate-200 hover:border-emerald-400/40 hover:text-emerald-200"
        asChild
      >
        <Link href={`/products/${slug}#detalles`}>Ver detalles tecnicos</Link>
      </Button>
    </div>
  );
}
