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
