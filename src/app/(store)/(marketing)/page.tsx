import { Suspense } from "react";

import { HeroHighlight } from "@/components/home/hero-highlight";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { ExperienceBanner } from "@/components/home/experience-banner";
import { LoyaltyBanner } from "@/components/home/loyalty-banner";
import { getCategoriesShowcase, getFeaturedProducts, getHeroHighlight } from "@/server/products";
import { SkeletonHero, SkeletonProductGrid, SkeletonSection } from "@/components/loading/skeletons";

export default async function MarketingHomePage() {
  const [heroProduct, featuredProducts, categories] = await Promise.all([
    getHeroHighlight(),
    getFeaturedProducts(),
    getCategoriesShowcase(),
  ]);

  return (
    <main className="relative pb-24">
      <div className="pointer-events-none absolute inset-x-12 -top-32 -z-10 h-[600px] rounded-[4rem] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_60%)] blur-3xl" />
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
        <Suspense fallback={<SkeletonHero />}>
          <HeroHighlight product={heroProduct} />
        </Suspense>
      </div>
      <Suspense fallback={<SkeletonProductGrid />}>
        <FeaturedGrid products={featuredProducts} />
      </Suspense>
      <Suspense fallback={<SkeletonSection />}>
        <CategoryShowcase categories={categories} />
      </Suspense>
      <ExperienceBanner />
      <LoyaltyBanner />
    </main>
  );
}
