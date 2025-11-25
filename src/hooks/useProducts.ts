import { useState, useEffect, useCallback } from "react";
import { seedProducts } from "@/data/seed-data";
import { mergeProducts } from "@/lib/syncService";

// Interfaz para el producto
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  highlights?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  weight?: number;
  featured?: boolean;
  isActive?: boolean;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  brand?: any;
  categories?: any;
  images?: any;
  specifications?: any;
  createdAt?: string;
  updatedAt?: string;
}

// Estados de sincronización
export enum SyncStatus {
  IDLE = "idle",
  SYNCING = "syncing",
  SUCCESS = "success",
  ERROR = "error",
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.IDLE);
  const [syncMessage, setSyncMessage] = useState<string>("");
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Función para sincronizar productos con la base de datos
  const syncWithDB = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      setSyncStatus(SyncStatus.SYNCING);
      setSyncMessage("Sincronizando productos con la base de datos...");

      // Obtener productos actuales del localStorage
      const currentProducts = JSON.parse(localStorage.getItem("products") || "[]");

      // Obtener productos eliminados del localStorage
      const deletedProducts = JSON.parse(localStorage.getItem("deletedProducts") || "[]");

      // Enviar productos al servidor para sincronización
      const response = await fetch("/api/products/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: currentProducts, deletedProducts }),
      });

      if (!response.ok) {
        throw new Error(`Error al sincronizar: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === SyncStatus.SUCCESS) {
        // Actualizar localStorage con los productos fusionados
        if (result.mergedProducts) {
          localStorage.setItem("products", JSON.stringify(result.mergedProducts));

          // Solo actualizar el estado si los productos fusionados son diferentes a los actuales
          const currentProducts = JSON.stringify(products);
          const mergedProductsStr = JSON.stringify(result.mergedProducts);

          if (currentProducts !== mergedProductsStr) {
            setProducts(result.mergedProducts);
          }

          // Limpiar la lista de productos eliminados después de una sincronización exitosa
          localStorage.setItem("deletedProducts", JSON.stringify([]));
        }

        setSyncStatus(SyncStatus.SUCCESS);
        setSyncMessage(result.message || "Sincronización completada");
        setLastSyncTime(new Date());
      } else {
        throw new Error(result.message || "Error desconocido durante la sincronización");
      }
    } catch (error) {
      console.error("Error en la sincronización:", error);
      setSyncStatus(SyncStatus.ERROR);
      setSyncMessage(error instanceof Error ? error.message : "Error desconocido");
    }
  }, []);

  // Función para cargar productos desde la base de datos
  const loadFromDB = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      setSyncStatus(SyncStatus.SYNCING);
      setSyncMessage("Cargando productos desde la base de datos...");

      const response = await fetch("/api/products/sync", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error al cargar productos: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === SyncStatus.SUCCESS) {
        // Obtener productos actuales del localStorage
        const currentProducts = JSON.parse(localStorage.getItem("products") || "[]");

        // Fusionar productos de localStorage con los de la base de datos
        const mergedProducts = mergeProducts(currentProducts, result.products);

        // Guardar en localStorage y actualizar el estado
        localStorage.setItem("products", JSON.stringify(mergedProducts));
        setProducts(mergedProducts);

        setSyncStatus(SyncStatus.SUCCESS);
        setSyncMessage("Productos cargados y fusionados correctamente");
        setLastSyncTime(new Date());
      } else {
        throw new Error(result.message || "Error desconocido al cargar productos");
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setSyncStatus(SyncStatus.ERROR);
      setSyncMessage(error instanceof Error ? error.message : "Error desconocido");
    }
  }, []);

  // Cargar productos al iniciar
  useEffect(() => {
    // Intentar cargar productos del localStorage
    const savedProducts = localStorage.getItem("products");
    console.log("useProducts: Productos en localStorage:", savedProducts);

    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        console.log("useProducts: Productos parseados:", parsedProducts);
        setProducts(parsedProducts);
      } catch (error) {
        console.error("Error al cargar productos del localStorage:", error);
        setProducts([]);
      }
    } else {
      // Inicialmente no hay productos
      console.log("useProducts: No hay productos en localStorage, inicializando lista vacía");
      setProducts([]);
    }

    setLoading(false);

    // Intentar cargar productos de la base de datos después de cargar los locales
    // Esto asegura que siempre tengamos los datos más recientes
    setTimeout(() => {
      loadFromDB();
    }, 1000);
  }, [loadFromDB]);

  // Guardar productos en localStorage cada vez que cambien
  useEffect(() => {
    if (!loading) {
      console.log("useProducts: Guardando productos en localStorage:", products);
      localStorage.setItem("products", JSON.stringify(products));

      // Programar una sincronización automática después de cambios
      // (con un pequeño retraso para evitar demasiadas sincronizaciones)
      const timeoutId = setTimeout(() => {
        syncWithDB();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [products, loading]); // Eliminamos syncWithDB de las dependencias para evitar el bucle infinito

  // Añadir un nuevo producto
  const addProduct = (product: Omit<Product, "id">) => {
    console.log("useProducts.addProduct: Datos del producto a añadir:", product);

    // Verificar si el producto ya existe por slug
    const existingProduct = products.find(p => p.slug === product.slug);
    if (existingProduct) {
      console.warn("useProducts.addProduct: El producto ya existe con slug:", product.slug);
      return existingProduct;
    }

    // Asegurar que isActive tenga un valor por defecto si no se proporciona
    const productWithDefaults = {
      ...product,
      isActive: product.isActive !== undefined ? product.isActive : true,
      featured: product.featured !== undefined ? product.featured : false,
      compareAtPrice: product.compareAtPrice || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const generateUniqueId = () => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  const extraRandom = Math.random().toString(36).substring(2, 15);
  return `product-${timestamp}-${randomPart}-${extraRandom}`;
};

const newProduct: Product = {
  ...productWithDefaults,
  id: generateUniqueId(),
} as Product;


    console.log("useProducts.addProduct: Nuevo producto creado:", newProduct);

    setProducts(prev => {
      // Verificar que el producto no exista en la lista actual
      if (prev.some(p => p.slug === newProduct.slug)) {
        console.warn("useProducts.addProduct: El producto ya existe en la lista");
        return prev;
      }

      const updatedProducts = [...prev, newProduct];
      console.log("useProducts.addProduct: Lista de productos actualizada:", updatedProducts);
      return updatedProducts;
    });

    // Sincronizar inmediatamente con la base de datos
    setTimeout(() => {
      syncWithDB();
    }, 500);

    return newProduct;
  };

  // Actualizar un producto
  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    // Actualizar en el estado local primero
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updatedProduct, updatedAt: new Date().toISOString() } : product
      )
    );

    // Esperar a que se complete la sincronización con la base de datos
    await syncWithDB();
  };


  // Eliminar un producto
  const deleteProduct = (id: string) => {
    // Eliminar del estado local
    setProducts(prev => prev.filter(product => product.id !== id));

    // Marcar como eliminado en localStorage
    if (typeof window !== "undefined") {
      try {
        const deletedProducts = JSON.parse(localStorage.getItem("deletedProducts") || "[]");
        deletedProducts.push(id);
        localStorage.setItem("deletedProducts", JSON.stringify(deletedProducts));
      } catch (error) {
        console.error("Error al marcar producto como eliminado en localStorage:", error);
      }
    }
  };

  // Obtener un producto por su slug
  const getProductBySlug = (slug: string) => {
    if (!slug || slug.trim() === "") return undefined;

    // Si no hay productos cargados, devolver undefined
    if (products.length === 0) {
      console.log("No hay productos cargados aún");
      return undefined;
    }

    console.log("Buscando producto con slug:", slug);
    console.log("Productos disponibles:", products);

    // Normalizar el slug para la comparación
    const normalizedSlug = slug.trim().toLowerCase();

    const foundProduct = products.find(product => {
      const normalizedProductSlug = product.slug ? product.slug.trim().toLowerCase() : "";
      console.log(`Comparando: "${normalizedProductSlug}" con "${normalizedSlug}"`);
      return normalizedProductSlug === normalizedSlug;
    });

    console.log("Producto encontrado:", foundProduct);
    return foundProduct;
  };

  // Obtener un producto por su ID
  const getProductById = (id: string) => {
    if (!id || id.trim() === "") return undefined;

    // Si no hay productos cargados, devolver undefined
    if (products.length === 0) {
      console.log("No hay productos cargados aún");
      return undefined;
    }

    console.log("Buscando producto con ID:", id);
    return products.find(product => product.id === id);
  };

  // Obtener productos destacados
  const getFeaturedProducts = () => {
    return products.filter(product => product.featured === true);
  };

  // Obtener productos activos
  const getActiveProducts = () => {
    return products.filter(product => product.isActive !== false);
  };

  // Obtener productos por categoría
  const getProductsByCategory = (category: string) => {
    if (!category || category.trim() === "") return [];

    return products.filter(product => 
      product.categories && 
      Array.isArray(product.categories) && 
      product.categories.some((cat: any) => 
        typeof cat === 'string' ? cat === category : cat.name === category
      )
    );
  };

  // Buscar productos por texto
  const searchProducts = (query: string) => {
    if (!query || query.trim() === "") return [];

    const normalizedQuery = query.trim().toLowerCase();

    return products.filter(product => {
      // Buscar en nombre, descripción y slug
      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.slug.toLowerCase().includes(normalizedQuery) ||
        // También buscar en etiquetas si existen
        (product.tags && product.tags.some(tag => 
          typeof tag === 'string' && tag.toLowerCase().includes(normalizedQuery)
        ))
      );
    });
  };

  // Obtener productos con bajo stock
  const getLowStockProducts = (threshold: number = 10) => {
    return products.filter(product => product.stock <= threshold);
  };

  // Obtener productos recién agregados (últimos 7 días)
  const getNewProducts = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return products.filter(product => {
      if (!product.createdAt) return false;
      const createdDate = new Date(product.createdAt);
      return createdDate >= cutoffDate;
    });
  };

  // Obtener productos más vendidos (simulado - en una app real esto vendría de la base de datos)
  const getBestSellingProducts = (limit: number = 10) => {
    // Simulación: ordenar aleatoriamente y devolver los primeros 'limit'
    return [...products]
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  };

  // Obtener productos en oferta (con compareAtPrice mayor que price)
  const getSaleProducts = () => {
    return products.filter(product => 
      product.compareAtPrice && 
      product.compareAtPrice > product.price
    );
  };

  // Obtener productos por rango de precios
  const getProductsByPriceRange = (minPrice: number, maxPrice: number) => {
    return products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
  };

  // Obtener productos por marca
  const getProductsByBrand = (brand: string) => {
    if (!brand || brand.trim() === "") return [];

    return products.filter(product => 
      product.brand && 
      (typeof product.brand === 'string' ? 
        product.brand === brand : 
        product.brand.name === brand)
    );
  };

  // Obtener productos por etiqueta
  const getProductsByTag = (tag: string) => {
    if (!tag || tag.trim() === "") return [];

    return products.filter(product => 
      product.tags && 
      product.tags.some(productTag => 
        typeof productTag === 'string' ? 
          productTag === tag : 
          productTag.name === tag
      )
    );
  };

  // Obtener productos relacionados (misma categoría o etiquetas similares)
  const getRelatedProducts = (productId: string, limit: number = 4) => {
    const product = getProductById(productId);
    if (!product) return [];

    // Obtener productos de la misma categoría o con etiquetas similares
    const relatedProducts = products.filter(p => {
      if (p.id === productId) return false;

      // Misma categoría
      if (product.categories && p.categories) {
        const hasSameCategory = product.categories.some(cat => 
          p.categories && p.categories.some(pCat => 
            (typeof cat === 'string' ? cat : cat.name) === 
            (typeof pCat === 'string' ? pCat : pCat.name)
          )
        );
        if (hasSameCategory) return true;
      }

      // Etiquetas similares
      if (product.tags && p.tags) {
        const hasSimilarTags = product.tags.some(tag => 
          p.tags && p.tags.some(pTag => 
            (typeof tag === 'string' ? tag : tag.name) === 
            (typeof pTag === 'string' ? pTag : pTag.name)
          )
        );
        if (hasSimilarTags) return true;
      }

      return false;
    });

    // Limitar el número de resultados
    return relatedProducts.slice(0, limit);
  };

  // Limpiar productos eliminados del localStorage (opcional, para mantenimiento)
  const clearDeletedProducts = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("deletedProducts");
    }
  };

  // Restaurar un producto eliminado
  const restoreProduct = (id: string) => {
    // Eliminar de la lista de eliminados en localStorage
    if (typeof window !== "undefined") {
      try {
        const deletedProducts = JSON.parse(localStorage.getItem("deletedProducts") || "[]");
        const updatedDeletedProducts = deletedProducts.filter((productId: string) => productId !== id);
        localStorage.setItem("deletedProducts", JSON.stringify(updatedDeletedProducts));

        // Notificar que el producto ha sido restaurado
        console.log(`Producto ${id} restaurado de la lista de eliminados`);
        return true;
      } catch (error) {
        console.error("Error al restaurar producto:", error);
        return false;
      }
    }
    return false;
  };

  // Obtener lista de productos eliminados
  const getDeletedProducts = () => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("deletedProducts") || "[]");
      } catch (error) {
        console.error("Error al obtener productos eliminados:", error);
        return [];
      }
    }
    return [];
  };

  return {
    products,
    loading,
    syncStatus,
    syncMessage,
    lastSyncTime,
    syncWithDB,
    loadFromDB,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductBySlug,
    getProductById,
    getFeaturedProducts,
    getActiveProducts,
    getProductsByCategory,
    searchProducts,
    getLowStockProducts,
    getNewProducts,
    getBestSellingProducts,
    getSaleProducts,
    getProductsByPriceRange,
    getProductsByBrand,
    getProductsByTag,
    getRelatedProducts,
    clearDeletedProducts,
    restoreProduct,
    getDeletedProducts,
  };
}
