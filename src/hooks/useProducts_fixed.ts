import { useState, useEffect } from "react";
import { seedProducts } from "@/data/seed-data";

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

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  // Guardar productos en localStorage cada vez que cambien
  useEffect(() => {
    if (!loading) {
      console.log("useProducts: Guardando productos en localStorage:", products);
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products, loading]);

  // Añadir un nuevo producto
  const addProduct = (product: Omit<Product, "id">) => {
    console.log("useProducts.addProduct: Datos del producto a añadir:", product);

    // Asegurar que isActive tenga un valor por defecto si no se proporciona
    const productWithDefaults = {
      ...product,
      isActive: product.isActive !== undefined ? product.isActive : true,
      featured: product.featured !== undefined ? product.featured : false,
      compareAtPrice: product.compareAtPrice || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newProduct: Product = {
      ...productWithDefaults,
      id: `product-${Date.now()}`,
    };

    console.log("useProducts.addProduct: Nuevo producto creado:", newProduct);

    setProducts(prev => {
      const updatedProducts = [...prev, newProduct];
      console.log("useProducts.addProduct: Lista de productos actualizada:", updatedProducts);
      return updatedProducts;
    });

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
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  // Obtener un producto por su slug
  const getProductBySlug = (slug: string) => {
    if (!slug || slug.trim() === "") return undefined;

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

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductBySlug,
  };
}