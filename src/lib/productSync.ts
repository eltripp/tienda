
// Servicio de sincronización entre localStorage y base de datos

import { Product } from "@/hooks/useProducts";
import { getLocalStorageProducts, setLocalStorageProducts } from "@/lib/localStorageProducts";

// Función para sincronizar productos de localStorage a la base de datos
export async function syncToDatabase(products: Product[]) {
  try {
    // Importar dinámicamente para evitar problemas en el cliente
    const { prisma } = await import("@/lib/prisma");

    // Procesar cada producto
    for (const product of products) {
      // Verificar si el producto ya existe en la base de datos
      const existingProduct = await prisma.product.findFirst({
        where: { 
          OR: [
            { id: product.id },
            { sku: product.sku }
          ]
        }
      });

      if (existingProduct) {
        // Actualizar producto existente
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            name: product.name,
            slug: product.slug,
            description: product.description,
            highlights: product.highlights,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            stock: product.stock,
            sku: product.sku,
            weight: product.weight,
            featured: product.featured,
            isActive: product.isActive,
            tags: product.tags,
            updatedAt: new Date(),
            // Procesar imágenes si existen
            ...(product.images && {
              images: {
                deleteMany: {},
                create: product.images.map((img: any, index: number) => ({
                  url: img.url,
                  alt: img.alt || product.name,
                  isPrimary: img.isPrimary || index === 0,
                  order: index
                }))
              }
            }),
            // Procesar especificaciones si existen
            ...(product.specifications && {
              specifications: {
                deleteMany: {},
                create: product.specifications.map((spec: any) => ({
                  name: spec.name,
                  value: spec.value
                }))
              }
            }),
            // Procesar categorías si existen
            ...(product.categories && {
              categories: {
                deleteMany: {},
                create: product.categories.map((cat: any) => {
                  // Si es un string, buscar o crear la categoría
                  if (typeof cat === "string") {
                    return {
                      category: {
                        connectOrCreate: {
                          where: { slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
                          create: {
                            name: cat,
                            slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                          }
                        }
                      }
                    };
                  }
                  // Si es un objeto, conectar por slug o id
                  return {
                    category: {
                      connect: cat.slug ? { slug: cat.slug } : { id: cat.id }
                    }
                  };
                })
              }
            })
          }
        });
      } else {
        // Crear nuevo producto
        await prisma.product.create({
          data: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            highlights: product.highlights,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            stock: product.stock,
            sku: product.sku,
            weight: product.weight,
            featured: product.featured,
            isActive: product.isActive,
            tags: product.tags,
            createdAt: product.createdAt ? new Date(product.createdAt) : new Date(),
            updatedAt: new Date(),
            // Procesar imágenes si existen
            ...(product.images && {
              images: {
                create: product.images.map((img: any, index: number) => ({
                  url: img.url,
                  alt: img.alt || product.name,
                  isPrimary: img.isPrimary || index === 0,
                  order: index
                }))
              }
            }),
            // Procesar especificaciones si existen
            ...(product.specifications && {
              specifications: {
                create: product.specifications.map((spec: any) => ({
                  name: spec.name,
                  value: spec.value
                }))
              }
            }),
            // Procesar categorías si existen
            ...(product.categories && {
              categories: {
                create: product.categories.map((cat: any) => {
                  // Si es un string, buscar o crear la categoría
                  if (typeof cat === "string") {
                    return {
                      category: {
                        connectOrCreate: {
                          where: { slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
                          create: {
                            name: cat,
                            slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                          }
                        }
                      }
                    };
                  }
                  // Si es un objeto, conectar por slug o id
                  return {
                    category: {
                      connect: cat.slug ? { slug: cat.slug } : { id: cat.id }
                    }
                  };
                })
              }
            })
          }
        });
      }
    }

    return { success: true, message: "Productos sincronizados correctamente" };
  } catch (error) {
    console.error("Error al sincronizar productos con la base de datos:", error);
    return { success: false, message: "Error al sincronizar productos", error };
  }
}

// Función para sincronizar productos de la base de datos a localStorage
export async function syncFromDatabase() {
  try {
    // Importar dinámicamente para evitar problemas en el cliente
    const { prisma } = await import("@/lib/prisma");
    const { mapProductToSummary } = await import("@/server/products");

    // Obtener todos los productos de la base de datos
    const dbProducts = await prisma.product.findMany({
      include: {
        brand: true,
        images: { orderBy: { order: "asc" } },
        categories: { include: { category: true } },
        specifications: true
      }
    });

    // Convertir productos de la base de datos al formato de localStorage
    const localStorageProducts = dbProducts.map(product => {
      const summary = mapProductToSummary(product);

      // Convertir al formato esperado por localStorage
      return {
        id: summary.id,
        name: summary.name,
        slug: summary.slug,
        description: summary.description,
        highlights: summary.highlights,
        price: summary.price,
        compareAtPrice: summary.compareAtPrice,
        stock: summary.stock,
        sku: summary.sku,
        weight: summary.weight,
        featured: summary.featured,
        isActive: summary.isActive,
        tags: summary.tags,
        rating: summary.rating,
        reviewCount: summary.reviewCount,
        brand: summary.brand?.name,
        categories: summary.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug
        })),
        images: summary.images.map(img => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
          order: img.order
        })),
        specifications: summary.specifications || [],
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString()
      };
    });

    // Actualizar localStorage
    setLocalStorageProducts(localStorageProducts);

    return { success: true, message: "Productos sincronizados desde la base de datos" };
  } catch (error) {
    console.error("Error al sincronizar productos desde la base de datos:", error);
    return { success: false, message: "Error al sincronizar productos", error };
  }
}

// Función para sincronizar en ambas direcciones (bidireccional)
export async function bidirectionalSync() {
  try {
    // Primero, sincronizar de localStorage a la base de datos
    const localStorageProducts = getLocalStorageProducts();
    const syncToDbResult = await syncToDatabase(localStorageProducts);

    if (!syncToDbResult.success) {
      throw new Error(syncToDbResult.message);
    }

    // Luego, sincronizar de la base de datos a localStorage para obtener los datos actualizados
    const syncFromDbResult = await syncFromDatabase();

    if (!syncFromDbResult.success) {
      throw new Error(syncFromDbResult.message);
    }

    return { success: true, message: "Sincronización bidireccional completada" };
  } catch (error) {
    console.error("Error en la sincronización bidireccional:", error);
    return { success: false, message: "Error en la sincronización bidireccional", error };
  }
}

// Función para detectar conflictos entre localStorage y base de datos
export async function detectConflicts() {
  try {
    // Importar dinámicamente para evitar problemas en el cliente
    const { prisma } = await import("@/lib/prisma");

    // Obtener productos de localStorage
    const localStorageProducts = getLocalStorageProducts();

    // Obtener productos de la base de datos
    const dbProducts = await prisma.product.findMany({
      select: {
        id: true,
        sku: true,
        slug: true,
        updatedAt: true
      }
    });

    // Detectar conflictos
    const conflicts = [];

    // Para cada producto en localStorage, verificar si hay un conflicto
    for (const lsProduct of localStorageProducts) {
      const dbProduct = dbProducts.find(p => 
        p.id === lsProduct.id || 
        p.sku === lsProduct.sku || 
        p.slug === lsProduct.slug
      );

      if (dbProduct) {
        const lsUpdatedAt = new Date(lsProduct.updatedAt || 0);
        const dbUpdatedAt = new Date(dbProduct.updatedAt);

        // Si las fechas de actualización son muy diferentes, hay un posible conflicto
        if (Math.abs(lsUpdatedAt.getTime() - dbUpdatedAt.getTime()) > 5000) { // 5 segundos de diferencia
          conflicts.push({
            productId: lsProduct.id,
            sku: lsProduct.sku,
            slug: lsProduct.slug,
            localStorageUpdatedAt: lsProduct.updatedAt,
            databaseUpdatedAt: dbProduct.updated.toISOString(),
            conflictType: lsUpdatedAt > dbUpdatedAt ? 'localStorage_newer' : 'database_newer'
          });
        }
      }
    }

    return { success: true, conflicts };
  } catch (error) {
    console.error("Error al detectar conflictos:", error);
    return { success: false, message: "Error al detectar conflictos", error };
  }
}

// Función para resolver conflictos
export async function resolveConflicts(resolution: 'localStorage' | 'database' | 'newest') {
  try {
    const conflictsResult = await detectConflicts();

    if (!conflictsResult.success) {
      throw new Error(conflictsResult.message);
    }

    const { conflicts } = conflictsResult;

    if (conflicts.length === 0) {
      return { success: true, message: "No hay conflictos que resolver" };
    }

    if (resolution === 'localStorage') {
      // Sincronizar localStorage a la base de datos
      const result = await syncToDatabase(getLocalStorageProducts());
      return result;
    } else if (resolution === 'database') {
      // Sincronizar base de datos a localStorage
      const result = await syncFromDatabase();
      return result;
    } else if (resolution === 'newest') {
      // Para cada conflicto, usar la versión más reciente
      const localStorageProducts = getLocalStorageProducts();

      // Importar dinámicamente para evitar problemas en el cliente
      const { prisma } = await import("@/lib/prisma");

      for (const conflict of conflicts) {
        const lsProduct = localStorageProducts.find(p => p.id === conflict.productId);

        if (conflict.conflictType === 'localStorage_newer') {
          // Actualizar base de datos con la versión de localStorage
          if (lsProduct) {
            await prisma.product.update({
              where: { id: conflict.productId },
              data: {
                name: lsProduct.name,
                slug: lsProduct.slug,
                description: lsProduct.description,
                highlights: lsProduct.highlights,
                price: lsProduct.price,
                compareAtPrice: lsProduct.compareAtPrice,
                stock: lsProduct.stock,
                sku: lsProduct.sku,
                weight: lsProduct.weight,
                featured: lsProduct.featured,
                isActive: lsProduct.isActive,
                tags: lsProduct.tags,
                updatedAt: new Date()
              }
            });
          }
        } else {
          // Obtener la versión más reciente de la base de datos y actualizar localStorage
          const dbProduct = await prisma.product.findUnique({
            where: { id: conflict.productId },
            include: {
              brand: true,
              images: true,
              categories: { include: { category: true } },
              specifications: true
            }
          });

          if (dbProduct) {
            // Actualizar el producto en localStorage
            const index = localStorageProducts.findIndex(p => p.id === conflict.productId);
            if (index !== -1) {
              const { mapProductToSummary } = await import("@/server/products");
              const summary = mapProductToSummary(dbProduct);

              localStorageProducts[index] = {
                id: summary.id,
                name: summary.name,
                slug: summary.slug,
                description: summary.description,
                highlights: summary.highlights,
                price: summary.price,
                compareAtPrice: summary.compareAtPrice,
                stock: summary.stock,
                sku: summary.sku,
                weight: summary.weight,
                featured: summary.featured,
                isActive: summary.isActive,
                tags: summary.tags,
                rating: summary.rating,
                reviewCount: summary.reviewCount,
                brand: summary.brand?.name,
                categories: summary.categories.map(cat => ({
                  id: cat.id,
                  name: cat.name,
                  slug: cat.slug
                })),
                images: summary.images.map(img => ({
                  id: img.id,
                  url: img.url,
                  alt: img.alt,
                  isPrimary: img.isPrimary,
                  order: img.order
                })),
                specifications: summary.specifications || [],
                createdAt: dbProduct.createdAt.toISOString(),
                updatedAt: dbProduct.updatedAt.toISOString()
              };
            }
          }
        }
      }

      // Guardar los cambios en localStorage
      setLocalStorageProducts(localStorageProducts);

      return { success: true, message: "Conflictos resueltos usando la versión más reciente" };
    }

    return { success: false, message: "Tipo de resolución no válido" };
  } catch (error) {
    console.error("Error al resolver conflictos:", error);
    return { success: false, message: "Error al resolver conflictos", error };
  }
}
