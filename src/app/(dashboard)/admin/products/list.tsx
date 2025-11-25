import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";

// Datos de ejemplo - en una app real estos vendrían de la API
const products = [
  {
    id: "1",
    name: "MacBook Pro 14"",
    sku: "MBP-14-2023",
    price: 1299900,
    stock: 25,
    status: "Activo",
    category: "Laptops",
    image: "/placeholder-product.jpg",
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    sku: "IP15P-128",
    price: 999900,
    stock: 82,
    status: "Activo",
    category: "Smartphones",
    image: "/placeholder-product.jpg",
  },
  {
    id: "3",
    name: "AirPods Pro",
    sku: "APP-2ND",
    price: 299900,
    stock: 127,
    status: "Activo",
    category: "Audio",
    image: "/placeholder-product.jpg",
  },
  {
    id: "4",
    name: "iPad Air",
    sku: "IPA-5TH",
    price: 699900,
    stock: 0,
    status: "Sin stock",
    category: "Tablets",
    image: "/placeholder-product.jpg",
  },
];

export default function AdminProductsList() {
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

      {/* Filtros y búsqueda */}
      <Card className="border-slate-900/70 bg-slate-950/60">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar productos..."
                className="pl-10 bg-slate-900/50 border-slate-800"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800">
                <Filter className="mr-2 h-4 w-4" /> Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
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
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-slate-900/60 text-sm text-slate-300">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-slate-800 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{formatCurrency(product.price, "CLP")}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.status === "Activo" ? "default" : "destructive"}
                      className={
                        product.status === "Activo"
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-red-500/10 text-red-300 border-red-500/30"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-slate-800 bg-slate-900">
                        <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-slate-100">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-slate-100">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-300">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
