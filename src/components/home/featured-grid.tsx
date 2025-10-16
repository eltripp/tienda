import type { ProductSummary } from "@/server/products";
import { ProductCard } from "@/components/products/product-card";

type FeaturedGridProps = {
  products: ProductSummary[];
};

export function FeaturedGrid({ products }: FeaturedGridProps) {
  return (
    <section className="mt-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
            Catálogo premium
          </p>
          <h2 className="font-heading text-3xl text-slate-50 sm:text-4xl">
            Selección curada para mentes exigentes
          </h2>
          <p className="max-w-2xl text-base text-slate-400">
            Filtramos cientos de lanzamientos globales para traerte hardware con garantía extendida, soporte experto y beneficios exclusivos para miembros Nova+.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
