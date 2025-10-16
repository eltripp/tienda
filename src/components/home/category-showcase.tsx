"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";

import { cn } from "@/lib/utils";

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  products?: {
    product: {
      id: string;
      name: string;
      images: { id: string; url: string; alt: string | null }[];
    };
  }[];
};

type CategoryShowcaseProps = {
  categories: CategoryNode[];
};

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="mt-24">
      <div className="mx-auto w-full max-w-7xl space-y-10 px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Explora por universo
          </p>
          <h2 className="font-heading text-3xl text-slate-50 sm:text-4xl">
            Elige tu próxima evolución tecnológica
          </h2>
          <p className="max-w-2xl text-base text-slate-400">
            Desde laptops de rendimiento extremo hasta smartphones plegables: nuestras colecciones se adaptan a cada flujo creativo, gaming competitivo o ecosistema inteligente.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category, index) => {
            const highlightProduct = category.products?.[0]?.product;
            const highlightImage = highlightProduct?.images?.[0];
            const fallbackImage = category.imageUrl;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true, margin: "-40px" }}
                className="group relative overflow-hidden rounded-3xl border border-slate-900/70 bg-slate-950/70 shadow-[0_30px_90px_-60px_rgba(45,212,191,0.4)] transition hover:border-emerald-400/40 hover:bg-slate-950"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10 opacity-0 transition group-hover:opacity-100" />
                <div className="relative grid h-full gap-6 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">
                        Universo
                      </p>
                      <h3 className="mt-1 font-heading text-2xl text-slate-100">
                        {category.name}
                      </h3>
                    </div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-slate-900/60 text-emerald-300 transition group-hover:border-emerald-500/40 group-hover:bg-emerald-500/20 group-hover:text-emerald-200">
                      <Layers className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="max-w-md text-sm text-slate-400">
                    {category.description ??
                      "Actualizamos semanalmente con lanzamientos seleccionados, accesorios certificados y combos optimizados."}
                  </p>

                  <div
                    className={cn(
                      "relative overflow-hidden rounded-2xl border border-slate-900/80 bg-slate-900/50",
                      highlightImage || fallbackImage ? "aspect-[16/9]" : "aspect-[4/3]",
                    )}
                  >
                    {highlightImage ? (
                      <Image
                        src={highlightImage.url}
                        alt={highlightImage.alt ?? highlightProduct?.name ?? category.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(min-width: 768px) 400px, 100vw"
                      />
                    ) : fallbackImage ? (
                      <Image
                        src={fallbackImage}
                        alt={category.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(min-width: 768px) 400px, 100vw"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-slate-500">
                        Foto próximamente
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4">
                      <p className="text-sm font-semibold text-slate-100">
                        {highlightProduct?.name ?? "Descubre la colección completa"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                    >
                      Ver colección
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Curado semanal
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
