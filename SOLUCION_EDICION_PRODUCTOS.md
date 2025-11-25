# Solución para el problema de edición de productos

## Problema identificado

Los productos agregados desde el panel de administración no se pueden editar ni encontrar correctamente. Esto se debe a que hay un problema en cómo se está comparando el slug del producto en la función `getProductBySlug`.

## Solución necesaria

### 1. Actualizar la función `getProductBySlug` en el hook `useProducts`

Reemplazar la función `getProductBySlug` (líneas 98-117) en el archivo `src/hooks/useProducts.ts` con este código:

```typescript
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
```

### 2. Actualizar la función `updateProduct` en el hook `useProducts`

Reemplazar la función `updateProduct` (líneas 84-91) en el archivo `src/hooks/useProducts.ts` con este código:

```typescript
// Actualizar un producto
const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
  setProducts(prev =>
    prev.map(product =>
      product.id === id ? { ...product, ...updatedProduct, updatedAt: new Date().toISOString() } : product
    )
  );
};
```

### 3. Limpiar el localStorage

Si después de actualizar el hook los productos aún no se encuentran correctamente, limpiar el localStorage del navegador y volver a agregar los productos.

## Pasos para implementar

1. Abrir el archivo `src/hooks/useProducts.ts`
2. Reemplazar la función `getProductBySlug` con el código proporcionado
3. Reemplazar la función `updateProduct` con el código proporcionado
4. Limpiar el localStorage del navegador
5. Recargar la página y agregar un nuevo producto para probar
6. Intentar editar el producto para verificar que se encuentre correctamente

## Verificación

Una vez implementados los cambios, verificar que:
1. Los productos se muestren correctamente en la lista de productos del admin
2. Los productos se puedan editar correctamente
3. Los productos se muestren correctamente en la sección cliente
