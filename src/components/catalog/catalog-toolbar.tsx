"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal } from "lucide-react";

import type { CatalogFilters, CatalogQuery } from "@/server/catalog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CatalogFiltersPanel } from "@/components/catalog/catalog-filters";
import { formatNumber } from "@/lib/utils";

const sortOptions: { label: string; value: NonNullable<CatalogQuery["sort"]> }[] = [
  { label: "Novedades", value: "newest" },
  { label: "Precio: menor a mayor", value: "price-asc" },
  { label: "Precio: mayor a menor", value: "price-desc" },
  { label: "Mejor valorados", value: "rating" },
];

type CatalogToolbarProps = {
  total: number;
  filters: CatalogFilters;
  selected: CatalogQuery;
};

export function CatalogToolbar({ total, filters, selected }: CatalogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-900/70 bg-slate-950/50 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Resultados
        </p>
        <p className="font-heading text-2xl text-slate-100">
          {formatNumber(total)} productos tecnológicos
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Select onValueChange={updateSort} defaultValue={selected.sort ?? "newest"}>
          <SelectTrigger className="w-[220px] rounded-xl border-slate-900 bg-slate-900/60 text-slate-200">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent className="border-slate-900 bg-slate-950 text-slate-200">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-xl border-slate-800 bg-slate-900/60 text-slate-200 hover:border-emerald-400/40 hover:text-emerald-200 lg:hidden"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto bg-slate-950 text-slate-100 sm:max-w-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading text-xl">Refina tu búsqueda</p>
                <p className="text-xs text-slate-500">
                  Explora categorías, marcas y presupuestos personalizados.
                </p>
              </div>
            </div>
            <CatalogFiltersPanel
              filters={filters}
              selected={selected}
              variant="sheet"
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
