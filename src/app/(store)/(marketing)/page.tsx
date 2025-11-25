import { Suspense } from "react";

import { HeroHighlight } from "@/components/home/hero-highlight";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { ExperienceBanner } from "@/components/home/experience-banner";
import { LoyaltyBanner } from "@/components/home/loyalty-banner";
import { LocalStorageProducts } from "@/components/home/localStorage-products";
import { getCategoriesShowcase, getFeaturedProducts, getHeroHighlight } from "@/server/products";
import { SkeletonHero, SkeletonProductGrid, SkeletonSection } from "@/components/loading/skeletons";

export default async function MarketingHomePage() {
  // Obtener productos destacados de localStorage
  let heroProduct = null;
  let featuredProducts = [];
  
  try {
    const { getLocalStorageProducts, mapAdminProductToCatalog } = await import("@/lib/localStorageProducts");
    const adminProducts = getLocalStorageProducts();
    
    // Filtrar productos activos
    const activeProducts = adminProducts.filter(product => product.isActive !== false);
    
    // Obtener productos destacados
    const featured = activeProducts.filter(product => product.featured);
    
    // Convertir a formato de catálogo
    featuredProducts = featured.map(product => mapAdminProductToCatalog(product));
    
    // Obtener el producto más destacado para el hero
    if (featured.length > 0) {
      // Ordenar por fecha de creación y rating
      const sortedProducts = featured.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        
        if (dateA !== dateB) {
          return dateB - dateA; // Más reciente primero
        }
        
        // Si las fechas son iguales, ordenar por rating
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA;
      });
      
      heroProduct = mapAdminProductToCatalog(sortedProducts[0]);
    }
  } catch (error) {
    console.error("Error al obtener productos de localStorage:", error);
  }

  // Obtener categorías de productos de localStorage
  let categories = [];
  try {
    const { getLocalStorageProducts } = await import("@/lib/localStorageProducts");
    const adminProducts = getLocalStorageProducts();
    
    // Extraer categorías de productos de localStorage
    const categoryMap = new Map();
    
    adminProducts.forEach(product => {
      if (product.categories && Array.isArray(product.categories) && product.isActive !== false) {
        product.categories.forEach(category => {
          const key = typeof category === "string" ? category : category.slug || category.name;
          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              id: `ls-${key}`,
              name: typeof category === "string" ? category : category.name,
              slug: typeof category === "string" ? category.toLowerCase().replace(/[^a-z0-9]+/g, "-") : category.slug,
              description: typeof category === "string" ? "" : (category.description || ""),
              imageUrl: typeof category === "string" ? "" : (category.imageUrl || ""),
              products: [],
            });
          }
          
          // Agregar un producto de ejemplo a la categoría
          const categoryData = categoryMap.get(key);
          if (categoryData.products.length === 0 && product.images && product.images.length > 0) {
            categoryData.products.push({
              product: {
                images: product.images,
              },
            });
          }
        });
      }
    });
    
    categories = Array.from(categoryMap.values());
  } catch (error) {
    console.error("Error al obtener categorías de localStorage:", error);
  }

  return (
    <main className="relative pb-24">
      <div className="pointer-events-none absolute inset-x-12 -top-32 -z-10 h-[600px] rounded-[4rem] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_60%)] blur-3xl" />
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
        {heroProduct ? (
          <Suspense fallback={<SkeletonHero />}>
            <HeroHighlight product={heroProduct} />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-96 rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-12 text-center">
            <p className="font-heading text-2xl text-slate-100">No hay productos destacados</p>
            <p className="mt-2 text-sm text-slate-400">Agrega productos desde el panel de administración para verlos aquí.</p>
          </div>
        )}
      </div>
      {featuredProducts.length > 0 ? (
        <Suspense fallback={<SkeletonProductGrid />}>
          <FeaturedGrid products={featuredProducts} />
        </Suspense>
      ) : null}
      <LocalStorageProducts />
      {categories.length > 0 ? (
        <Suspense fallback={<SkeletonSection />}>
          <CategoryShowcase categories={categories} />
        </Suspense>
      ) : null}
      <ExperienceBanner />
      <LoyaltyBanner />
    </main>
  );
}
