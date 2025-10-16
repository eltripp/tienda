import Link from "next/link";
import { notFound } from "next/navigation";

import type { ProductSummary } from "@/server/products";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductCard } from "@/components/products/product-card";

function buildPageHref(page: number, searchParams: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  params.set("page", String(page));
  return `?${params.toString()}`;
}

type CatalogGridProps = {
  products: ProductSummary[];
  searchParams: Record<string, string | number | undefined>;
  total: number;
  page: number;
  totalPages: number;
};

export function CatalogGrid({ products, searchParams, total, page, totalPages }: CatalogGridProps) {
  if (page > totalPages && totalPages !== 0) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-10">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Mostrando {total === 0 ? 0 : products.length} de {total} resultados
        </span>
      </div>
      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-12 text-center">
          <p className="font-heading text-2xl text-slate-100">No encontramos coincidencias</p>
          <p className="mt-2 text-sm text-slate-400">
            Ajusta los filtros, cambia el orden o explora otra categoria para descubrir mas productos.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Ver todo el catalogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? buildPageHref(page - 1, searchParams) : undefined}
                aria-disabled={page === 1}
                className="rounded-xl border-slate-800 bg-slate-900/60 text-slate-200"
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <PaginationItem key={`page-${pageNumber}`}>
                  <PaginationLink
                    href={buildPageHref(pageNumber, searchParams)}
                    isActive={pageNumber === page}
                    className="rounded-xl border-slate-800 bg-slate-900/60 text-slate-200 data-[active=true]:border-emerald-500/50 data-[active=true]:bg-emerald-500/10 data-[active=true]:text-emerald-200"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href={page < totalPages ? buildPageHref(page + 1, searchParams) : undefined}
                aria-disabled={page === totalPages}
                className="rounded-xl border-slate-800 bg-slate-900/60 text-slate-200"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
