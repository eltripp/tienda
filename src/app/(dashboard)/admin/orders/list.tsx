import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
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
import Link from "next/link";

// Datos de ejemplo - en una app real estos vendrían de la API
const orders = [
  {
    id: "TN-9204",
    customer: {
      name: "Constanza Rojas",
      email: "constanza@example.com",
    },
    total: 1859000,
    status: "shipped",
    date: "2023-10-28T14:30:00Z",
    items: 3,
  },
  {
    id: "TN-9203",
    customer: {
      name: "Ignacio Díaz",
      email: "ignacio@example.com",
    },
    total: 1299900,
    status: "processing",
    date: "2023-10-28T11:15:00Z",
    items: 2,
  },
  {
    id: "TN-9202",
    customer: {
      name: "Kibernum",
      email: "compras@kibernum.com",
    },
    total: 8599000,
    status: "pending",
    date: "2023-10-27T16:45:00Z",
    items: 8,
  },
  {
    id: "TN-9201",
    customer: {
      name: "María González",
      email: "maria@example.com",
    },
    total: 549900,
    status: "delivered",
    date: "2023-10-27T09:20:00Z",
    items: 1,
  },
  {
    id: "TN-9200",
    customer: {
      name: "Pedro Morales",
      email: "pedro@example.com",
    },
    total: 2199000,
    status: "cancelled",
    date: "2023-10-26T18:30:00Z",
    items: 4,
  },
];

const statusConfig = {
  pending: {
    label: "Pendiente",
    icon: Clock,
    color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  },
  processing: {
    label: "Procesando",
    icon: Package,
    color: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  },
  shipped: {
    label: "Despachado",
    icon: Truck,
    color: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  },
  delivered: {
    label: "Entregado",
    icon: CheckCircle,
    color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    color: "bg-red-500/10 text-red-300 border-red-500/30",
  },
};

export default function AdminOrdersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Logística</p>
          <h1 className="font-heading text-3xl text-slate-100">Pedidos</h1>
          <p className="text-sm text-slate-400">Monitorea entregas críticas y SLA de despacho.</p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="border-slate-900/70 bg-slate-950/60">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar por ID, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-800"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="processing">Procesando</option>
                <option value="shipped">Despachado</option>
                <option value="delivered">Entregado</option>
                <option value="cancelled">Cancelado</option>
              </select>
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800">
                <Filter className="mr-2 h-4 w-4" /> Más filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de pedidos */}
      <Card className="border-slate-900/70 bg-slate-950/60">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100">Listado</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-900/70 text-xs uppercase tracking-[0.2em] text-slate-500">
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
                const statusColor = statusConfig[order.status as keyof typeof statusConfig].color;
                const statusLabel = statusConfig[order.status as keyof typeof statusConfig].label;

                return (
                  <TableRow key={order.id} className="border-slate-900/60 text-sm text-slate-300">
                    <TableCell className="font-medium text-slate-100">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-100">{order.customer.name}</p>
                        <p className="text-xs text-slate-500">{order.customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{formatCurrency(order.total, "CLP")}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusLabel}
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
                            Ver detalles
                          </DropdownMenuItem>
                          {order.status === "pending" && (
                            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-slate-100">
                              <Package className="mr-2 h-4 w-4" />
                              Marcar como procesando
                            </DropdownMenuItem>
                          )}
                          {order.status === "processing" && (
                            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-slate-100">
                              <Truck className="mr-2 h-4 w-4" />
                              Marcar como despachado
                            </DropdownMenuItem>
                          )}
                          {order.status === "shipped" && (
                            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-slate-100">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Marcar como entregado
                            </DropdownMenuItem>
                          )}
                          {order.status !== "cancelled" && order.status !== "delivered" && (
                            <>
                              <DropdownMenuSeparator className="bg-slate-800" />
                              <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-300">
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancelar pedido
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
