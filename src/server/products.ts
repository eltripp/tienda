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
    // Obtener productos destacados de localStorage
    let localStorageFeaturedProducts = [];
    try {
      const { getLocalStorageProducts, mapAdminProductToCatalog } = await import("@/lib/localStorageProducts");
      const adminProducts = getLocalStorageProducts();
      localStorageFeaturedProducts = adminProducts
        .filter(product => product.featured && product.isActive !== false)
        .map(product => mapAdminProductToCatalog(product))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 12);
    } catch (error) {
      console.error("Error al obtener productos destacados de localStorage:", error);
    }

    // Obtener productos destacados de la base de datos
    const dbProducts = await prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: {
        brand: true,
        images: { orderBy: { order: "asc" } },
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
      take: Math.max(0, 12 - localStorageFeaturedProducts.length),
    });

    // Combinar productos de localStorage y base de datos
    const allFeaturedProducts = [
      ...localStorageFeaturedProducts,
      ...dbProducts.map(mapProductToSummary)
    ];

    if (!allFeaturedProducts.length) return fallbackProducts.slice(0, 8);
    return allFeaturedProducts;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return fallbackProducts.slice(0, 8);
  }
});

// ✅ Producto destacado del hero
export const getHeroHighlight = cache(async (): Promise<ProductSummary> => {
  try {
    // Primero buscar en localStorage
    try {
      const { getLocalStorageProducts, mapAdminProductToCatalog } = await import("@/lib/localStorageProducts");
      const adminProducts = getLocalStorageProducts();
      
      // Filtrar productos destacados y activos
      const featuredProducts = adminProducts.filter(product => 
        product.featured && product.isActive !== false
      );
      
      if (featuredProducts.length > 0) {
        // Ordenar por fecha de creación y rating
        const sortedProducts = featuredProducts.sort((a, b) => {
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
        
        // Devolver el producto más destacado
        return mapAdminProductToCatalog(sortedProducts[0]);
      }
    } catch (error) {
      console.error("Error al buscar producto destacado en localStorage:", error);
    }
    
    // Si no hay productos destacados en localStorage, buscar en la base de datos
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
    // Obtener categorías de productos de localStorage
    let localStorageCategories = new Map();
    try {
      const { getLocalStorageProducts } = await import("@/lib/localStorageProducts");
      const adminProducts = getLocalStorageProducts();
      
      // Extraer categorías de productos de localStorage
      adminProducts.forEach(product => {
        if (product.categories && Array.isArray(product.categories) && product.isActive !== false) {
          product.categories.forEach(category => {
            const key = typeof category === "string" ? category : category.slug || category.name;
            if (!localStorageCategories.has(key)) {
              localStorageCategories.set(key, {
                id: `ls-${key}`,
                name: typeof category === "string" ? category : category.name,
                slug: typeof category === "string" ? category.toLowerCase().replace(/[^a-z0-9]+/g, "-") : category.slug,
                description: typeof category === "string" ? "" : (category.description || ""),
                imageUrl: typeof category === "string" ? "" : (category.imageUrl || ""),
                products: [],
              });
            }
            
            // Agregar un producto de ejemplo a la categoría
            const categoryData = localStorageCategories.get(key);
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
    } catch (error) {
      console.error("Error al obtener categorías de localStorage:", error);
    }
    
    // Obtener categorías de la base de datos
    const dbCategories = await prisma.category.findMany({
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

    // Combinar categorías de localStorage y base de datos
    const allCategories = [
      ...dbCategories,
      ...Array.from(localStorageCategories.values())
    ];

    if (!allCategories.length) {
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
    // Primero buscar en localStorage
    try {
      const { getLocalStorageProducts, mapAdminProductToCatalog } = await import("@/lib/localStorageProducts");
      const adminProducts = getLocalStorageProducts();
      
      // Normalizar el slug para la comparación
      const normalizedSlug = slug.trim().toLowerCase();
      
      const localStorageProduct = adminProducts.find(product => {
        const normalizedProductSlug = product.slug ? product.slug.trim().toLowerCase() : "";
        return normalizedProductSlug === normalizedSlug;
      });
      
      if (localStorageProduct) {
        console.log("Producto encontrado en localStorage:", localStorageProduct.name);
        return mapAdminProductToCatalog(localStorageProduct);
      }
    } catch (error) {
      console.error("Error al buscar producto en localStorage:", error);
    }
    
    // Si no se encuentra en localStorage, buscar en la base de datos
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
