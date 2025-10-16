"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";

import type { ProductSummary } from "@/server/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";

type HeroHighlightProps = {
  product: ProductSummary;
};

export function HeroHighlight({ product }: HeroHighlightProps) {
  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-slate-950 via-slate-950/60 to-slate-900 px-6 py-12 shadow-[0_40px_120px_-60px_rgba(16,185,129,0.4)] sm:px-10 md:py-16 lg:px-16">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.25),transparent)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.25),transparent)] blur-3xl" />

      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 space-y-6"
        >
          <Badge className="rounded-full border border-emerald-500/40 bg-transparent px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Nuevo lanzamiento
          </Badge>
          <h1 className="font-heading text-4xl leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
            {product.name}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-slate-300">
            {product.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-900 bg-slate-900/60 px-4 py-2 text-emerald-300">
              <Sparkles className="h-4 w-4" />
              <span>{product.highlights}</span>
            </div>
            {product.brand && (
              <div className="rounded-full border border-slate-900 bg-slate-900/60 px-4 py-2 text-slate-400">
                {product.brand.name}
              </div>
            )}
            {product.rating && (
              <div className="rounded-full border border-slate-900 bg-slate-900/60 px-4 py-2 text-slate-400">
                {product.rating.toFixed(1)} ★ ({product.reviewCount ?? 0} reseñas)
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Precio lanzamiento
              </p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-4xl font-semibold text-emerald-400">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                size="lg"
                className="rounded-2xl bg-emerald-500 px-6 py-3 text-base font-semibold text-emerald-950 transition hover:bg-emerald-400"
                asChild
              >
                <Link href={`/products/${product.slug}`}>
                  Comprar ahora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-2xl border border-emerald-500/40 bg-transparent px-6 py-3 text-base font-semibold text-emerald-300 transition hover:bg-slate-900"
              >
                Ver demo <Play className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative z-0"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-500/20 bg-slate-900/70 p-6 shadow-[0_100px_140px_-90px_rgba(16,185,129,0.5)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_55%)]" />
            {primaryImage ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-slate-900">
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt ?? product.name}
                  fill
                  className={cn("object-cover transition duration-700", {
                    "scale-105": true,
                  })}
                  sizes="(min-width: 1024px) 500px, 100vw"
                />
              </div>
            ) : (
              <div className="grid aspect-[4/3] place-items-center rounded-[1.75rem] border border-dashed border-slate-800 bg-slate-900 text-slate-500">
                Imagen próximamente
              </div>
            )}
            <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-900 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
                  Stock disponible
                </p>
                <p className="text-base font-semibold text-slate-100">
                  {product.stock} unidades
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
                  Envío estimado
                </p>
                <p className="text-base font-semibold text-slate-100">
                  24 - 48 horas
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
