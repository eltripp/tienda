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
          setProducts(result.mergedProducts);

          // Los productos se actualizan automáticamente en el estado
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
  }, [products, loading, syncWithDB]);

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
  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updatedProduct, updatedAt: new Date().toISOString() } : product
      )
    );
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

  // Obtener productos destacados
  const getFeaturedProducts = () => {
    return products.filter(product => product.featured === true && product.isActive !== false);
  };

  // Obtener productos activos
  const getActiveProducts = () => {
    return products.filter(product => product.isActive !== false);
  };

  // Obtener productos por categoría
  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => 
      product.isActive !== false && 
      product.categories && 
      product.categories.some((cat: any) => cat.id === categoryId)
    );
  };

  // Obtener productos por marca
  const getProductsByBrand = (brandId: string) => {
    return products.filter(product => 
      product.isActive !== false && 
      product.brand && 
      product.brand.id === brandId
    );
  };

  // Buscar productos
  const searchProducts = (query: string) => {
    if (!query || query.trim() === "") return getActiveProducts();

    const normalizedQuery = query.trim().toLowerCase();
    return products.filter(product => 
      product.isActive !== false && (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        (product.tags && product.tags.some((tag: string) => tag.toLowerCase().includes(normalizedQuery)))
      )
    );
  };

  // Forzar sincronización
  const forceSync = async () => {
    await syncWithDB();
  };

  return {
    products,
    loading,
    syncStatus,
    syncMessage,
    lastSyncTime,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductBySlug,
    getFeaturedProducts,
    getActiveProducts,
    getProductsByCategory,
    getProductsByBrand,
    searchProducts,
    forceSync,
  };
}
