import { Suspense } from "react";

import { CatalogFiltersPanel } from "@/components/catalog/catalog-filters";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { SkeletonProductGrid } from "@/components/loading/skeletons";
import { fetchCatalogFilters, fetchCatalogProducts, type CatalogQuery } from "@/server/catalog";

function mapSearchParams(searchParams: Record<string, string | string[] | undefined>): CatalogQuery {
  const toNumber = (value?: string | string[]) => {
    if (!value) return undefined;
    const str = Array.isArray(value) ? value[0] : value;
    const numeric = Number(str);
    return Number.isNaN(numeric) ? undefined : numeric;
  };

  const getString = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value ?? undefined;

  const query: CatalogQuery = {
    search: getString(searchParams.q ?? searchParams.search),
    category: getString(searchParams.category),
    brand: getString(searchParams.brand),
    minPrice: toNumber(searchParams.minPrice),
    maxPrice: toNumber(searchParams.maxPrice),
    availability: getString(searchParams.availability) as CatalogQuery["availability"],
    sort: (getString(searchParams.sort) as CatalogQuery["sort"]) ?? "newest",
    page: toNumber(searchParams.page) ?? 1,
    perPage: toNumber(searchParams.perPage) ?? undefined,
  };

  return query;
}

type ProductsPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = mapSearchParams(searchParams);

  const [filters, catalog] = await Promise.all([
    fetchCatalogFilters(),
    fetchCatalogProducts(query),
  ]);

  const sanitizedSearchParams: Record<string, string | number | undefined> = {
    ...(query.search ? { search: query.search } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.brand ? { brand: query.brand } : {}),
    ...(query.minPrice ? { minPrice: query.minPrice } : {}),
    ...(query.maxPrice ? { maxPrice: query.maxPrice } : {}),
    ...(query.availability ? { availability: query.availability } : {}),
    ...(query.sort ? { sort: query.sort } : {}),
    ...(query.perPage ? { perPage: query.perPage } : {}),
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 sm:px-10 lg:flex-row lg:px-12">
      <CatalogFiltersPanel filters={filters} selected={query} />
      <div className="flex-1 space-y-8">
        <CatalogToolbar total={catalog.total} filters={filters} selected={query} />
        <Suspense fallback={<SkeletonProductGrid />}>
          <CatalogGrid
            products={catalog.products}
            searchParams={sanitizedSearchParams}
            total={catalog.total}
            page={catalog.page}
            totalPages={catalog.totalPages}
          />
        </Suspense>
      </div>
    </main>
  );
}
