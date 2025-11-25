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

  // Obtener productos de localStorage
  let localStorageProducts = [];
  try {
    // Si estamos en el servidor, no podemos acceder a localStorage directamente
    if (typeof window === "undefined") {
      // En el servidor, intentamos obtener los productos de la base de datos
      const dbProducts = await prisma.product.findMany({
        where: { isActive: true },
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
      });
      
      localStorageProducts = dbProducts.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        sku: product.sku,
        stock: product.stock,
        weight: product.weight,
        featured: product.featured,
        isActive: product.isActive,
        tags: product.tags ? product.tags.split(",") : [],
        highlights: product.highlights || [],
        images: product.images.map((img, index) => ({
          id: img.id,
          url: img.url,
          alt: img.alt || product.name,
          order: img.order,
          isPrimary: img.isPrimary || index === 0,
        })),
        brand: product.brand ? {
          id: product.brand.id,
          name: product.brand.name,
          slug: product.brand.slug,
        } : null,
        categories: product.categories.map(cat => ({
          id: cat.category.id,
          name: cat.category.name,
          slug: cat.category.slug,
        })),
        specifications: [],
        rating: 0,
        reviewCount: 0,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }));
    } else {
      // En el cliente, podemos acceder a localStorage
      const { getLocalStorageProducts, mapAdminProductToCatalog } = await import("@/lib/localStorageProducts");
      const adminProducts = getLocalStorageProducts();
      localStorageProducts = adminProducts
        .filter(product => product.isActive !== false) // Solo productos activos
        .map(product => mapAdminProductToCatalog(product));
    }
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }

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
    // Filtrar productos de localStorage según los criterios de búsqueda
    let filteredLocalStorageProducts = localStorageProducts;
    
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredLocalStorageProducts = filteredLocalStorageProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (query.category) {
      filteredLocalStorageProducts = filteredLocalStorageProducts.filter(product => 
        product.categories.some(cat => cat.slug === query.category)
      );
    }
    
    if (query.brand) {
      filteredLocalStorageProducts = filteredLocalStorageProducts.filter(product => 
        product.brand?.slug === query.brand
      );
    }
    
    if (query.minPrice !== undefined) {
      filteredLocalStorageProducts = filteredLocalStorageProducts.filter(product => 
        product.price >= query.minPrice!
      );
    }
    
    if (query.maxPrice !== undefined) {
      filteredLocalStorageProducts = filteredLocalStorageProducts.filter(product => 
        product.price <= query.maxPrice!
      );
    }
    
    if (query.availability === "in-stock") {
      filteredLocalStorageProducts = filteredLocalStorageProducts.filter(product => 
        product.stock > 0
      );
    } else if (query.availability === "out-of-stock") {
      filteredLocalStorageProducts = filteredLocalStorageProducts.filter(product => 
        product.stock === 0
      );
    } else if (query.availability === "preorder") {
      filteredLocalStorageProducts = filteredLocalStorageProducts.filter(product => 
        product.stock <= 0 && product.isActive
      );
    }
    
    // Ordenar productos de localStorage
    if (query.sort === "price-asc") {
      filteredLocalStorageProducts.sort((a, b) => a.price - b.price);
    } else if (query.sort === "price-desc") {
      filteredLocalStorageProducts.sort((a, b) => b.price - a.price);
    } else if (query.sort === "rating") {
      filteredLocalStorageProducts.sort((a, b) => b.rating - a.rating);
    } else { // newest (por defecto)
      filteredLocalStorageProducts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    // Paginar productos de localStorage
    const totalLocalStorage = filteredLocalStorageProducts.length;
    const paginatedLocalStorageProducts = filteredLocalStorageProducts.slice(skip, skip + perPage);
    
    // Obtener productos de la base de datos
    const [dbProducts, dbTotal] = await prisma.$transaction([
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
        skip: Math.max(0, skip - totalLocalStorage), // Ajustar skip para evitar duplicados
        take: Math.max(0, perPage - paginatedLocalStorageProducts.length), // Ajustar take para completar la página
      }),
      prisma.product.count({ where }),
    ]);

    // Combinar productos de localStorage y base de datos
    // Priorizar productos de localStorage si hay alguno
    const allProducts = paginatedLocalStorageProducts.length > 0 
      ? paginatedLocalStorageProducts 
      : dbProducts.slice(0, perPage);
    
    const total = paginatedLocalStorageProducts.length > 0 
      ? totalLocalStorage 
      : dbTotal;

    return {
      products: allProducts,
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
    // Obtener productos de localStorage
    let localStorageProducts = [];
    try {
      const { getLocalStorageProducts } = await import("@/lib/localStorageProducts");
      localStorageProducts = getLocalStorageProducts();
    } catch (error) {
      console.error("Error al cargar productos de localStorage:", error);
    }

    // Extraer categorías y marcas de productos de localStorage
    const localStorageCategories = new Map();
    const localStorageBrands = new Map();
    const localStoragePrices: number[] = [];

    localStorageProducts.forEach(product => {
      // Procesar categorías
      if (product.categories && Array.isArray(product.categories)) {
        product.categories.forEach(category => {
          const key = typeof category === "string" ? category : category.slug || category.name;
          if (!localStorageCategories.has(key)) {
            localStorageCategories.set(key, {
              id: `ls-${key}`,
              name: typeof category === "string" ? category : category.name,
              slug: typeof category === "string" ? category.toLowerCase().replace(/[^a-z0-9]+/g, "-") : category.slug,
              productCount: 0,
            });
          }
          localStorageCategories.get(key).productCount++;
        });
      }

      // Procesar marcas
      if (product.brand) {
        const brandKey = typeof product.brand === "string" ? product.brand : product.brand.slug || product.brand.name;
        if (!localStorageBrands.has(brandKey)) {
          localStorageBrands.set(brandKey, {
            id: `ls-${brandKey}`,
            name: typeof product.brand === "string" ? product.brand : product.brand.name,
            slug: typeof product.brand === "string" ? product.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-") : product.brand.slug,
            productCount: 0,
          });
        }
        localStorageBrands.get(brandKey).productCount++;
      }

      // Procesar precios
      if (typeof product.price === "number") {
        localStoragePrices.push(product.price);
      }
    });

    // No obtener categorías, marcas y precios de la base de datos
    const categories = [];
    const brands = [];
    const priceStats = { _min: { price: 0 }, _max: { price: 0 } };

    // Solo usar categorías, marcas y precios de localStorage
    const allCategories = Array.from(localStorageCategories.values());
    const allBrands = Array.from(localStorageBrands.values());
    const lsMinPrice = localStoragePrices.length > 0 ? Math.min(...localStoragePrices) : 0;
    const lsMaxPrice = localStoragePrices.length > 0 ? Math.max(...localStoragePrices) : 0;

    return {
      categories: allCategories,
      brands: allBrands,
      priceRange: {
        min: lsMinPrice,
        max: lsMaxPrice,
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
