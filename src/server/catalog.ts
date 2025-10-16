import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { mapProductToSummary, type ProductSummary } from "@/server/products";
import { seedBrands, seedCategories, seedProducts } from "@/data/seed-data";

export type CatalogQuery = {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: "in-stock" | "out-of-stock" | "preorder";
  sort?: "newest" | "price-asc" | "price-desc" | "rating";
  page?: number;
  perPage?: number;
};

export type CatalogFilters = {
  categories: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }[];
  brands: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }[];
  priceRange: {
    min: number;
    max: number;
  };
  availability: {
    label: string;
    value: Exclude<CatalogQuery["availability"], undefined>;
  }[];
};

const DEFAULT_PAGE_SIZE = 12;

const buildSortOrder = (sort?: CatalogQuery["sort"]): Prisma.ProductOrderByWithRelationInput => {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "rating":
      return { rating: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
};

export async function fetchCatalogProducts(query: CatalogQuery) {
  const page = Math.max(1, query.page ?? 1);
  const perPage = Math.min(24, query.perPage ?? DEFAULT_PAGE_SIZE);
  const skip = (page - 1) * perPage;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
            { tags: { has: query.search.toLowerCase() } },
          ],
        }
      : {}),
    ...(query.category
      ? {
          categories: {
            some: {
              category: {
                slug: query.category,
              },
            },
          },
        }
      : {}),
    ...(query.brand
      ? {
          brand: {
            slug: query.brand,
          },
        }
      : {}),
    ...(query.minPrice || query.maxPrice
      ? {
          price: {
            ...(typeof query.minPrice === "number" ? { gte: query.minPrice } : {}),
            ...(typeof query.maxPrice === "number" ? { lte: query.maxPrice } : {}),
          },
        }
      : {}),
    ...(query.availability === "in-stock"
      ? { stock: { gt: 0 } }
      : query.availability === "out-of-stock"
        ? { stock: 0 }
        : query.availability === "preorder"
          ? { stock: { lte: 0 }, isActive: true }
          : {}),
  };

  try {
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          brand: true,
          images: {
            orderBy: {
              order: "asc",
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: buildSortOrder(query.sort),
        skip,
        take: perPage,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: products.map(mapProductToSummary),
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  } catch (error) {
    console.error("Error fetching catalog products:", error);

    const fallback = seedProducts.map((product, index) => {
      const brand = seedBrands.find(
        (candidate) => candidate.slug === product.brand?.connect?.slug,
      );
      const categorySlugs =
        product.categories?.create?.map((item) => item.category.connect?.slug) ?? [];

      const matchesSearch =
        !query.search ||
        product.name.toLowerCase().includes(query.search.toLowerCase()) ||
        product.description.toLowerCase().includes(query.search.toLowerCase());

      const matchesCategory =
        !query.category || categorySlugs.includes(query.category);

      const matchesBrand =
        !query.brand || brand?.slug === query.brand;

      const priceNumber = Number(product.price);
      const matchesPrice =
        (!query.minPrice || priceNumber >= query.minPrice) &&
        (!query.maxPrice || priceNumber <= query.maxPrice);

      if (!matchesSearch || !matchesCategory || !matchesBrand || !matchesPrice) {
        return null;
      }

      return {
        id: `fallback-${index}`,
        name: product.name,
        slug: product.slug,
        description: product.description,
        highlights: product.highlights,
        price: priceNumber,
        compareAtPrice: product.compareAtPrice
          ? Number(product.compareAtPrice)
          : undefined,
        stock: product.stock,
        sku: product.sku,
        weight: product.weight ? Number(product.weight) : undefined,
        featured: product.featured,
        isActive: product.isActive,
        tags: product.tags,
        rating: product.rating ? Number(product.rating) : undefined,
        reviewCount: product.reviewCount,
        brand: brand
          ? {
              id: `fallback-brand-${brand.slug}`,
              slug: brand.slug,
              name: brand.name,
              logoUrl: brand.logoUrl,
              website: brand.website,
            }
          : null,
        images:
          product.images?.create?.map((image, imageIndex) => ({
            id: `fallback-image-${index}-${imageIndex}`,
            url: image.url,
            alt: image.alt,
            isPrimary: image.isPrimary,
            order: image.order,
          })) ?? [],
        categories:
          categorySlugs
            .map((slug) => {
              const category = seedCategories.find((c) => c.slug === slug);
              return category
                ? {
                    id: `fallback-category-${slug}`,
                    slug,
                    name: category.name,
                  }
                : null;
            })
            .filter(Boolean) ?? [],
      } satisfies ProductSummary;
    }).filter(Boolean) as ProductSummary[];

    const total = fallback.length;
    const start = skip;
    const end = skip + perPage;

    return {
      products: fallback.slice(start, end),
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  }
}

export async function fetchCatalogFilters(): Promise<CatalogFilters> {
  try {
    const [categories, brands, priceStats] = await Promise.all([
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.brand.findMany({
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.product.aggregate({
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        productCount: category._count.products,
      })),
      brands: brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        productCount: brand._count.products,
      })),
      priceRange: {
        min: priceStats._min.price ? Number(priceStats._min.price) : 0,
        max: priceStats._max.price ? Number(priceStats._max.price) : 0,
      },
      availability: [
        { label: "Disponible", value: "in-stock" },
        { label: "Agotado", value: "out-of-stock" },
        { label: "Preventa", value: "preorder" },
      ],
    };
  } catch (error) {
    console.error("Error fetching catalog filters:", error);

    const categories = seedCategories.map((category) => ({
      id: `fallback-${category.slug}`,
      name: category.name,
      slug: category.slug,
      productCount: seedProducts.filter((product) =>
        product.categories?.create?.some(
          (relation) => relation.category.connect?.slug === category.slug,
        ),
      ).length,
    }));

    const brands = seedBrands.map((brand) => ({
      id: `fallback-${brand.slug}`,
      name: brand.name,
      slug: brand.slug,
      productCount: seedProducts.filter(
        (product) => product.brand?.connect?.slug === brand.slug,
      ).length,
    }));

    const prices = seedProducts.map((product) => Number(product.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return {
      categories,
      brands,
      priceRange: { min, max },
      availability: [
        { label: "Disponible", value: "in-stock" },
        { label: "Agotado", value: "out-of-stock" },
        { label: "Preventa", value: "preorder" },
      ],
    };
  }
}
