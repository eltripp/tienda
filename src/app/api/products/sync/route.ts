import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncDBToLocalStorage, hasProductChanged, mergeProducts, SyncStatus } from "@/lib/syncService";
import type { Product } from "@/hooks/useProducts";

// Endpoint para sincronizar productos desde localStorage a la base de datos
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    if (!body || body.trim() === '') {
      return NextResponse.json(
        { error: "El cuerpo de la solicitud está vacío" },
        { status: 400 }
      );
    }
    
    let products: Product[];
    let deletedProducts: string[] = [];

    try {
      const parsedBody = JSON.parse(body);
      products = parsedBody.products;
      deletedProducts = parsedBody.deletedProducts || [];
    } catch (parseError) {
      console.error("Error al parsear JSON:", parseError);
      return NextResponse.json(
        { error: "El cuerpo de la solicitud no es un JSON válido" },
        { status: 400 }
      );
    }

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: "Se requiere un array de productos para sincronizar" },
        { status: 400 }
      );
    }

    let syncedCount = 0;
    const errors: string[] = [];

    // Obtener todos los productos actuales de la base de datos
    const dbProducts = await prisma.product.findMany();

    // Crear mapa de productos de la base de datos por slug para búsqueda rápida
    const dbProductsBySlug = new Map<string, any>();
    dbProducts.forEach(product => {
      if (product.slug) {
        dbProductsBySlug.set(product.slug, product);
      }
    });

    // Procesar productos eliminados
    for (const deletedProductId of deletedProducts) {
      try {
        // Buscar el producto en la base de datos por ID
        const productToDelete = dbProducts.find(p => p.id === deletedProductId);

        if (productToDelete) {
          // Eliminar el producto de la base de datos
          await prisma.product.delete({
            where: { id: deletedProductId }
          });
          syncedCount++;
        }
      } catch (error) {
        console.error(`Error al eliminar producto ${deletedProductId}:`, error);
        errors.push(`Error al eliminar producto ${deletedProductId}: ${
          error instanceof Error ? error.message : String(error)
        }`);
      }
    }

    // Actualizar la lista de productos de la base de datos después de las eliminaciones
    const updatedDbProducts = await prisma.product.findMany();
    dbProductsBySlug.clear();
    updatedDbProducts.forEach(product => {
      if (product.slug) {
        dbProductsBySlug.set(product.slug, product);
      }
    });

    // Procesar cada producto del localStorage
    for (const localProduct of products) {
      try {
        if (!localProduct.slug) {
          errors.push(`El producto sin ID o slug no se puede sincronizar`);
          continue;
        }

        // Verificar si el producto existe en la base de datos
        const existingProduct = dbProductsBySlug.get(localProduct.slug);

        if (existingProduct) {
          // El producto existe, verificar si ha cambiado
          const hasChanged = hasProductChanged(localProduct, existingProduct as Product);

          if (hasChanged) {
            // Actualizar producto existente
            await prisma.product.update({
              where: { slug: localProduct.slug },
              data: {
                name: localProduct.name,
                description: localProduct.description,
                highlights: localProduct.highlights || null,
                price: localProduct.price,
                compareAtPrice: localProduct.compareAtPrice || null,
                stock: localProduct.stock,
                weight: localProduct.weight || null,
                featured: localProduct.featured !== undefined ? localProduct.featured : false,
                isActive: localProduct.isActive !== false,
                tags: Array.isArray(localProduct.tags) 
                  ? localProduct.tags.join(",") 
                  : localProduct.tags || "",
                updatedAt: new Date(),
              },
            });
            syncedCount++;
          }
        } else {
          // El producto no existe, crearlo
          await prisma.product.create({
            data: {
              name: localProduct.name,
              slug: localProduct.slug,
              description: localProduct.description,
              highlights: localProduct.highlights || null,
              price: localProduct.price,
              compareAtPrice: localProduct.compareAtPrice || null,
              stock: localProduct.stock,
              sku: localProduct.sku,
              weight: localProduct.weight || null,
              featured: localProduct.featured !== undefined ? localProduct.featured : false,
              isActive: localProduct.isActive !== false,
              tags: Array.isArray(localProduct.tags) 
                ? localProduct.tags.join(",") 
                : localProduct.tags || "",
            },
          });
          syncedCount++;
        }
      } catch (error) {
        console.error(`Error al sincronizar producto ${localProduct.slug}:`, error);
        errors.push(`Error al sincronizar producto ${localProduct.slug}: ${
          error instanceof Error ? error.message : String(error)
        }`);
      }
    }

    // Sincronizar los productos actualizados de vuelta a localStorage
    // Esto se hace para asegurar que los IDs generados por la base de datos estén en localStorage
    const finalDbProducts = await prisma.product.findMany();
    const mergedProducts = mergeProducts(products, finalDbProducts as Product[]);

    // Devolver los productos fusionados para que el cliente los guarde en localStorage
    return NextResponse.json({
      status: SyncStatus.SUCCESS,
      message: `Sincronización completada. ${syncedCount} productos sincronizados.`,
      syncedCount,
      errors: errors.length > 0 ? errors : undefined,
      mergedProducts,
    });
  } catch (error) {
    console.error("Error en la sincronización:", error);
    return NextResponse.json(
      { 
        status: SyncStatus.ERROR,
        message: "Error al sincronizar productos",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Endpoint para obtener productos de la base de datos y sincronizarlos con localStorage
export async function GET() {
  try {
    // Obtener todos los productos de la base de datos
    const dbProducts = await prisma.product.findMany({
      include: {
        brand: true,
        images: { orderBy: { order: "asc" } },
        categories: { include: { category: true } },
      },
    });

    // Convertir al formato del cliente
    const formattedProducts = dbProducts.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      highlights: product.highlights,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
      stock: product.stock,
      sku: product.sku,
      weight: product.weight ? Number(product.weight) : undefined,
      featured: product.featured,
      isActive: product.isActive,
      tags: product.tags ? product.tags.split(",") : [],
      rating: product.rating ? Number(product.rating) : undefined,
      reviewCount: product.reviewCount,
      brand: product.brand,
      categories: product.categories.map(c => c.category),
      images: product.images,
      specifications: [], // No se incluyen en esta consulta
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      status: SyncStatus.SUCCESS,
      message: "Productos obtenidos de la base de datos",
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { 
        status: SyncStatus.ERROR,
        message: "Error al obtener productos de la base de datos",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
