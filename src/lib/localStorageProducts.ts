// Funciones para manejar productos guardados en localStorage

import type { Product } from "@/hooks/useProducts";

// Obtiene los productos guardados en localStorage
export function getLocalStorageProducts(): Product[] {
  if (typeof window === "undefined") return [];

  try {
    const products = localStorage.getItem("products");
    const allProducts = products ? JSON.parse(products) : [];

    // Obtener lista de productos eliminados
    const deletedProducts = JSON.parse(localStorage.getItem("deletedProducts") || "[]");

    // Filtrar productos eliminados
    return allProducts.filter((product: Product) => !deletedProducts.includes(product.id));
  } catch (error) {
    console.error("Error al obtener productos de localStorage:", error);
    return [];
  }
}

// Convierte un producto del formato del admin al formato del catálogo
export function mapAdminProductToCatalog(adminProduct: Product) {
  return {
    id: adminProduct.id,
    name: adminProduct.name,
    slug: adminProduct.slug,
    description: adminProduct.description,
    price: adminProduct.price,
    compareAtPrice: adminProduct.compareAtPrice,
    sku: adminProduct.sku,
    stock: adminProduct.stock,
    weight: adminProduct.weight,
    featured: adminProduct.featured,
    isActive: adminProduct.isActive !== false, // Por defecto true si no se especifica
    tags: adminProduct.tags,
    highlights: adminProduct.highlights,
    images: adminProduct.images?.map((img, index) => ({
      id: `img-${index}`,
      url: img.url,
      alt: img.alt || adminProduct.name,
      order: index,
      isPrimary: img.isPrimary || index === 0,
    })) || [],
    brand: adminProduct.brand ? {
      id: adminProduct.brand,
      name: adminProduct.brand,
      slug: adminProduct.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    } : null,
    categories: adminProduct.categories?.map(cat => {
      if (typeof cat === "string") {
        return {
          id: cat,
          name: cat,
          slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        };
      } else {
        return {
          id: cat.id || cat.slug,
          name: cat.name,
          slug: cat.slug,
        };
      }
    }) || [],
    specifications: adminProduct.specifications || [],
    rating: 0, // Por defecto
    reviewCount: 0, // Por defecto
    createdAt: adminProduct.createdAt || new Date().toISOString(),
    updatedAt: adminProduct.updatedAt || new Date().toISOString(),
  };
}
