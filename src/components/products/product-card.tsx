"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart, ShoppingCart } from "lucide-react";

import type { ProductSummary } from "@/server/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type ProductCardProps = {
  product: ProductSummary;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
  const addProduct = useCartStore((state) => state.addProduct);

  const handleAddToCart = async () => {
    try {
      await addProduct(product.id, 1);
    } catch (error) {
      console.error("No se pudo agregar el producto al carrito", error);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true, margin: "-40px" }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-slate-900/60 bg-slate-950/60 p-4 transition hover:border-emerald-500/40 hover:bg-slate-950",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-900/50">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            width={640}
            height={480}
            className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid aspect-[4/3] place-items-center text-sm text-slate-500">
            Imagen proximamente
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.featured && (
            <Badge className="rounded-full border border-emerald-500/50 bg-slate-950/80 text-xs uppercase tracking-[0.3em] text-emerald-200">
              Destacado
            </Badge>
          )}
          {product.compareAtPrice && (
            <Badge className="rounded-full border border-red-500/50 bg-red-500/10 text-xs font-semibold text-red-300">
              -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </Badge>
          )}
        </div>
        <button
          type="button"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-slate-900/80 bg-slate-950/80 text-slate-300 opacity-0 transition hover:text-rose-400 group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 pt-6">
        <div className="space-y-2">
          <Link href={`/products/${product.slug}`} className="flex items-start justify-between gap-3">
            <div>
              <p className="font-heading text-lg text-slate-100 transition group-hover:text-emerald-300">
                {product.name}
              </p>
              {product.brand && (
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">
                  {product.brand.name}
                </p>
              )}
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 text-slate-500 transition group-hover:text-emerald-300" />
          </Link>
          <p className="line-clamp-2 text-sm text-slate-400">{product.description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-end gap-2 text-slate-100">
            <span className="text-2xl font-semibold text-emerald-400">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-slate-500 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Button
              className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Agregar
            </Button>
            <Link
              href={`/products/${product.slug}`}
              className="text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
