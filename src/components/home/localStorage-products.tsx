
"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import { SkeletonProductGrid } from "@/components/loading/skeletons";
import { getLocalStorageProducts, mapAdminProductToCatalog } from "@/lib/localStorageProducts";

export function LocalStorageProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const adminProducts = getLocalStorageProducts();
        const catalogProducts = adminProducts
          .filter(product => product.isActive !== false)
          .map(product => mapAdminProductToCatalog(product));
        setProducts(catalogProducts);
      } catch (error) {
        console.error("Error al cargar productos de localStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <SkeletonProductGrid />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
            Productos destacados
          </p>
          <h2 className="font-heading text-3xl text-slate-50 sm:text-4xl">
            Nuestras últimas incorporaciones
          </h2>
          <p className="max-w-2xl text-base text-slate-400">
            Descubre los productos más recientes agregados a nuestro catálogo, seleccionados para ofrecerte la mejor tecnología del mercado.
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
