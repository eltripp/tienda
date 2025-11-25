// Servicio de sincronización entre localStorage y la base de datos

import { Product } from "@/hooks/useProducts";
import { getLocalStorageProducts } from "./localStorageProducts";
import { prisma } from "@/lib/prisma";

// Estado de sincronización
export enum SyncStatus {
  IDLE = "idle",
  SYNCING = "syncing",
  SUCCESS = "success",
  ERROR = "error",
}

// Interface para el resultado de la sincronización
export interface SyncResult {
  status: SyncStatus;
  message: string;
  syncedCount?: number;
  errors?: string[];
}

// Función para sincronizar productos de localStorage a la base de datos
export async function syncLocalStorageToDB(): Promise<SyncResult> {
  if (typeof window !== "undefined") {
    // Esta función solo debe ejecutarse en el servidor
    return {
      status: SyncStatus.ERROR,
      message: "Esta función solo debe ejecutarse en el servidor",
    };
  }

  try {
    // Obtener productos de localStorage (simulado)
    // En un entorno real, necesitaríamos pasar estos datos como parámetro
    // ya que no podemos acceder a localStorage desde el servidor

    // Esta es una función placeholder que debe ser llamada desde un endpoint
    // que reciba los productos del cliente
    return {
      status: SyncStatus.ERROR,
      message: "Función no implementada - debe ser llamada desde un endpoint con los datos del cliente",
    };
  } catch (error) {
    console.error("Error al sincronizar productos con la base de datos:", error);
    return {
      status: SyncStatus.ERROR,
      message: "Error al sincronizar productos con la base de datos",
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

// Función para sincronizar productos de la base de datos a localStorage
export function syncDBToLocalStorage(products: Product[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("products", JSON.stringify(products));
    console.log("Productos sincronizados desde la base de datos a localStorage");
  } catch (error) {
    console.error("Error al sincronizar productos a localStorage:", error);
  }
}

// Función para comparar productos y detectar cambios
export function hasProductChanged(localProduct: Product, dbProduct: Product): boolean {
  // Campos a comparar para detectar cambios
  const fieldsToCompare: (keyof Product)[] = [
    "name",
    "slug",
    "description",
    "highlights",
    "price",
    "compareAtPrice",
    "stock",
    "sku",
    "weight",
    "featured",
    "isActive",
    "tags",
  ];

  return fieldsToCompare.some(field => {
    const localValue = localProduct[field];
    const dbValue = dbProduct[field];

    // Manejar valores nulos/undefined
    if (localValue === null || localValue === undefined) {
      return dbValue !== null && dbValue !== undefined;
    }
    if (dbValue === null || dbValue === undefined) {
      return true;
    }

    // Comparar valores
    return JSON.stringify(localValue) !== JSON.stringify(dbValue);
  });
}

// Función para mezclar productos de localStorage y base de datos
export function mergeProducts(localProducts: Product[], dbProducts: Product[]): Product[] {
  // Obtener productos eliminados del localStorage
  let deletedProducts: string[] = [];
  if (typeof window !== "undefined") {
    try {
      deletedProducts = JSON.parse(localStorage.getItem("deletedProducts") || "[]");
    } catch (error) {
      console.error("Error al obtener productos eliminados:", error);
    }
  }

  // Filtrar productos eliminados
  const filteredLocalProducts = localProducts.filter(product => 
    !deletedProducts.includes(product.id)
  );

  // Crear mapa de productos de la base de datos por slug para búsqueda rápida
  const dbProductsBySlug = new Map<string, Product>();
  dbProducts.forEach(product => {
    if (product.slug) {
      dbProductsBySlug.set(product.slug, product);
    }
  });

  // Procesar productos locales
  const mergedProducts = filteredLocalProducts.map(localProduct => {
    // Si existe en la base de datos, verificar si ha cambiado
    if (localProduct.slug && dbProductsBySlug.has(localProduct.slug)) {
      const dbProduct = dbProductsBySlug.get(localProduct.slug)!;

      // Si el producto local se actualizó más recientemente, mantener la versión local
      if (localProduct.updatedAt && dbProduct.updatedAt) {
        const localDate = new Date(localProduct.updatedAt);
        const dbDate = new Date(dbProduct.updatedAt);

        if (localDate > dbDate) {
          return localProduct;
        }
      }

      // Si no hay información de fecha o la versión de la BD es más reciente, usar la versión de la BD
      return dbProduct;
    }

    // Si no existe en la base de datos, mantener el producto local
    return localProduct;
  });

  // Agregar productos de la base de datos que no existen en localStorage
  dbProducts.forEach(dbProduct => {
    if (dbProduct.slug && !filteredLocalProducts.some(p => p.slug === dbProduct.slug)) {
      mergedProducts.push(dbProduct);
    }
  });

  return mergedProducts;
}
