import { Plus } from "lucide-react";

import { seedProducts } from "@/data/seed-data";
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

export default function AdminProductsPage() {
  const products = seedProducts.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Inventario</p>
          <h1 className="font-heading text-3xl text-slate-100">Productos</h1>
          <p className="text-sm text-slate-400">Gestiona catálogo, stock y etiquetas destacadas.</p>
        </div>
        <Button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400">
          <Plus className="mr-2 h-4 w-4" /> Nuevo producto
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.slug} className="border-slate-900/60 text-sm text-slate-300">
                  <TableCell className="font-medium text-slate-100">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{formatCurrency(Number(product.price))}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                      Activo
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
