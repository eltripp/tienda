"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";

export default function AdminProductsPage() {
  const { products, loading, deleteProduct } = useProducts();
  
  console.log("AdminProductsPage: Productos disponibles:", products);

  // Función para manejar la eliminación de productos
  const handleDelete = (id: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar este producto?`)) {
      deleteProduct(id);
      alert(`Producto eliminado correctamente`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Inventario</p>
          <h1 className="font-heading text-3xl text-slate-100">Productos</h1>
          <p className="text-sm text-slate-400">Gestiona catálogo, stock y etiquetas destacadas.</p>
        </div>
        <Button asChild className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400">
          <Link href="/admin/products/add">
            <Plus className="mr-2 h-4 w-4" /> Nuevo producto
          </Link>
        </Button>
      </div>
      <Card className="border-slate-900/70 bg-slate-950/60">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100">Listado</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-900/70 text-xs uppercase tracking-[0.2em] text-slate-500">
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                    Cargando productos...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                    No hay productos. Añade tu primer producto.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="border-slate-900/60 text-sm text-slate-300">
                    <TableCell className="font-medium text-slate-100">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{formatCurrency(Number(product.price), "CLP")}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <span className={`rounded-full px-3 py-1 text-xs ${product.isActive ? "bg-emerald-500/10 text-emerald-300" : "bg-slate-700/50 text-slate-400"}`}>
                        {product.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100">
                          <Link href={`/admin/products/edit/${product.slug}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(product.id)}
                          className="border-red-600/50 text-red-400 hover:bg-red-600/20 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
