import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { seedBrands, seedCategories, seedProducts } from "@/data/seed-data";

export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  highlights?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  sku: string;
  weight?: number | null;
  featured: boolean;
  isActive: boolean;
  tags: string[];
  rating?: number | null;
  reviewCount?: number | null;
  brand: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    website?: string | null;
  } | null;
  images: {
    id: string;
    url: string;
    alt?: string | null;
    isPrimary?: boolean | null;
    order?: number | null;
  }[];
  categories: {
    id: string;
    slug: string;
    name: string;
  }[];
};

type ProductRecord = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    images: true;
    categories: {
      include: {
        category: true;
      };
    };
  };
}>;

// ✅ Convierte un producto de Prisma en un objeto plano serializable
export const mapProductToSummary = (product: ProductRecord): ProductSummary => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  highlights: product.highlights ?? undefined,
  price: Number(product.price),
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
  reviewCount: product.reviewCount ? Number(product.reviewCount) : undefined,
  brand: product.brand
    ? {
        id: product.brand.id,
        name: product.brand.name,
        slug: product.brand.slug,
        logoUrl: product.brand.logoUrl,
        website: product.brand.website,
      }
    : null,
  images: product.images.map((image) => ({
    id: image.id,
    url: image.url,
    alt: image.alt ?? undefined,
    isPrimary: image.isPrimary,
    order: image.order,
  })),
  categories: product.categories.map((relation) => ({
    id: relation.category.id,
    slug: relation.category.slug,
    name: relation.category.name,
  })),
});

// ✅ Datos de respaldo cuando la BD está vacía
const fallbackProducts: ProductSummary[] = seedProducts.map((product, index) => {
  const brand = seedBrands.find(
    (candidate) => candidate.slug === product.brand?.connect?.slug,
  );
  const categories = product.categories?.create?.map((relation, idx) => {
    const slug = relation.category.connect?.slug;
    const category = seedCategories.find((c) => c.slug === slug);
    return {
      id: `seed-category-${slug ?? idx}`,
      slug: slug ?? "",
      name: category?.name ?? slug ?? "Sin categoría",
    };
  });

  return {
    id: `seed-product-${index}`,
    name: product.name,
    slug: product.slug,
    description: product.description,
    highlights: product.highlights,
    price: Number(product.price),
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
    reviewCount: product.reviewCount ?? undefined,
    brand: brand
      ? {
          id: `seed-brand-${brand.slug}`,
          name: brand.name,
          slug: brand.slug,
          logoUrl: brand.logoUrl,
          website: brand.website,
        }
      : null,
    images:
      product.images?.create?.map((image, idx2) => ({
        id: `seed-image-${index}-${idx2}`,
        url: image.url,
        alt: image.alt,
        isPrimary: image.isPrimary,
        order: image.order,
      })) ?? [],
    categories: categories ?? [],
  };
});

// ✅ Productos destacados
export const getFeaturedProducts = cache(async (): Promise<ProductSummary[]> => {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: {
        brand: true,
        images: { orderBy: { order: "asc" } },
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });

    if (!products.length) return fallbackProducts.slice(0, 8);
    return products.map(mapProductToSummary);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return fallbackProducts.slice(0, 8);
  }
});

// ✅ Producto destacado del hero
export const getHeroHighlight = cache(async (): Promise<ProductSummary> => {
  try {
    const product = await prisma.product.findFirst({
      where: { featured: true, isActive: true },
      orderBy: [{ createdAt: "desc" }, { rating: "desc" }],
      include: {
        brand: true,
        images: true,
        categories: { include: { category: true } },
      },
    });

    if (!product) return fallbackProducts[0];
    return mapProductToSummary(product);
  } catch (error) {
    console.error("Error fetching hero highlight:", error);
    return fallbackProducts[0];
  }
});

// ✅ Categorías destacadas con productos
export const getCategoriesShowcase = cache(async () => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          take: 1,
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    if (!categories.length) {
      return seedCategories.map((category, index) => ({
        id: `seed-category-${index}`,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
      }));
    }

    // 🔧 Convertir Decimals dentro de los productos
    return categories.map((category) => ({
      ...category,
      products: category.products.map((relation) => ({
        ...relation,
        product: {
          ...relation.product,
          price: Number(relation.product.price),
          compareAtPrice: relation.product.compareAtPrice
            ? Number(relation.product.compareAtPrice)
            : null,
          weight: relation.product.weight
            ? Number(relation.product.weight)
            : null,
          rating: relation.product.rating
            ? Number(relation.product.rating)
            : null,
        },
      })),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return seedCategories.map((category, index) => ({
      id: `seed-category-${index}`,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
    }));
  }
});

// ✅ Producto por slug
export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        images: { orderBy: { order: "asc" } },
        specifications: true,
        categories: { include: { category: true } },
      },
    });

    if (!product) return null;

    return {
      ...mapProductToSummary(product),
      specifications: product.specifications.map((spec) => ({
        ...spec,
        value:
          typeof spec.value === "object" &&
          spec.value !== null &&
          "toNumber" in spec.value
            ? Number((spec.value as any).toNumber())
            : spec.value,
      })),
      description: product.description,
      highlights: product.highlights,
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}
