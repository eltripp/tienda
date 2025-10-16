"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, RefreshCcw } from "lucide-react";

import type { CatalogFilters, CatalogQuery } from "@/server/catalog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";

type CatalogFiltersProps = {
  filters: CatalogFilters;
  selected: CatalogQuery;
  variant?: "sidebar" | "sheet";
};

export function CatalogFiltersPanel({
  filters,
  selected,
  variant = "sidebar",
}: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    selected.minPrice ?? filters.priceRange.min,
    selected.maxPrice ?? filters.priceRange.max,
  ]);

  const queryObject = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return params;
  }, [searchParams]);

  const updateParam = (key: string, value?: string | number | null) => {
    const next = new URLSearchParams(queryObject.toString());
    if (value === undefined || value === null || value === "" || value === "0") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const Wrapper = (variant === "sidebar" ? "aside" : "div") as keyof JSX.IntrinsicElements;
  const containerClass = cn(
    "space-y-6 rounded-3xl border border-slate-900/70 bg-slate-950/50 p-6",
    variant === "sidebar"
      ? "hidden w-72 flex-shrink-0 lg:block"
      : "w-full",
  );

  return (
    <Wrapper className={containerClass}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            <Filter className="h-4 w-4" />
          </span>
          <div>
            <p className="font-heading text-lg text-slate-100">Filtros</p>
            <p className="text-xs text-slate-500">
              Ajusta tu búsqueda según lo que necesitas.
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl border border-slate-800 bg-transparent text-slate-400 hover:border-emerald-400/40 hover:text-emerald-300"
          onClick={clearFilters}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="border-slate-900/80" />

      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Categoría
        </p>
        <div className="space-y-3">
          {filters.categories.map((category) => {
            const checked = selected.category === category.slug;
            return (
              <Label
                key={category.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-900/60 bg-slate-900/40 p-3 text-sm text-slate-300 transition hover:border-emerald-500/30 hover:bg-slate-900",
                  checked && "border-emerald-400/60 bg-emerald-500/10 text-emerald-200",
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) =>
                      updateParam("category", value ? category.slug : null)
                    }
                  />
                  <div>
                    <p>{category.name}</p>
                    <p className="text-xs text-slate-500">
                      {category.productCount} productos
                    </p>
                  </div>
                </div>
              </Label>
            );
          })}
        </div>
      </section>

      <Separator className="border-slate-900/80" />

      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Marca
        </p>
        <div className="space-y-2">
          {filters.brands.map((brand) => {
            const checked = selected.brand === brand.slug;
            return (
              <Label
                key={brand.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-900/60 bg-slate-900/40 p-3 text-sm text-slate-300 transition hover:border-emerald-500/30 hover:bg-slate-900",
                  checked && "border-emerald-400/60 bg-emerald-500/10 text-emerald-200",
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) =>
                      updateParam("brand", value ? brand.slug : null)
                    }
                  />
                  <p>{brand.name}</p>
                </div>
                <span className="text-xs text-slate-500">{brand.productCount}</span>
              </Label>
            );
          })}
        </div>
      </section>

      <Separator className="border-slate-900/80" />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Rango de precio
          </p>
          <span className="text-xs text-slate-400">
            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
          </span>
        </div>
        <Slider
          min={Math.max(0, filters.priceRange.min)}
          max={Math.max(filters.priceRange.max, filters.priceRange.min + 1)}
          step={10}
          value={priceRange}
          onValueChange={(value) => setPriceRange([value[0], value[1]])}
          onValueCommit={(value) => {
            updateParam("minPrice", value[0]);
            updateParam("maxPrice", value[1]);
          }}
        />
        <div className="flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            className="underline-offset-4 hover:underline"
            onClick={() => {
              setPriceRange([filters.priceRange.min, filters.priceRange.max]);
              updateParam("minPrice", null);
              updateParam("maxPrice", null);
            }}
          >
            Restablecer
          </button>
        </div>
      </section>

      <Separator className="border-slate-900/80" />

      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Disponibilidad
        </p>
        <div className="space-y-2">
          {filters.availability.map((option) => {
            const checked = selected.availability === option.value;
            return (
              <Label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-900/60 bg-slate-900/40 p-3 text-sm text-slate-300 transition hover:border-emerald-500/30 hover:bg-slate-900",
                  checked && "border-emerald-400/60 bg-emerald-500/10 text-emerald-200",
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) =>
                      updateParam("availability", value ? option.value : null)
                    }
                  />
                  <p>{option.label}</p>
                </div>
              </Label>
            );
          })}
        </div>
      </section>
    </Wrapper>
  );
}
