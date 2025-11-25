import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, TrendingUp, User, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/lib/utils";
import Link from "next/link";

// Datos de ejemplo - en una app real estos vendrían de la API
const customer = {
  id: "1",
  name: "Constanza Rojas",
  email: "constanza@example.com",
  phone: "+56 9 1234 5678",
  avatar: "https://avatar.vercel.sh/constanza@example.com",
  joinDate: "2023-01-15",
  lastOrder: "2023-10-28",
  totalOrders: 12,
  totalSpent: 4689000,
  status: "active",
  addresses: [
    {
      id: "1",
      fullName: "Constanza Rojas",
      street: "Av. Providencia 1234",
      city: "Santiago",
      state: "Región Metropolitana",
      postalCode: "7500000",
      country: "Chile",
      isDefault: true,
    },
    {
      id: "2",
      fullName: "Constanza Rojas",
      street: "Calle Las Heras 567",
      city: "Viña del Mar",
      state: "Valparaíso",
      postalCode: "2520000",
      country: "Chile",
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: "1",
      brand: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    },
    {
      id: "2",
      brand: "Mastercard",
      last4: "8888",
      expMonth: 8,
      expYear: 2024,
      isDefault: false,
    },
  ],
  recentOrders: [
    {
      id: "TN-9204",
      date: "2023-10-28T14:30:00Z",
      total: 1859000,
      status: "shipped",
      items: 3,
    },
    {
      id: "TN-9185",
      date: "2023-10-15T10:20:00Z",
      total: 1299900,
      status: "delivered",
      items: 2,
    },
    {
      id: "TN-9152",
      date: "2023-09-28T16:45:00Z",
      total: 899900,
      status: "delivered",
      items: 1,
    },
  ],
};

const statusConfig = {
  active: {
    label: "Activo",
    color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  },
  inactive: {
    label: "Inactivo",
    color: "bg-slate-500/10 text-slate-300 border-slate-500/30",
  },
};

const orderStatusConfig = {
  pending: {
    label: "Pendiente",
    color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  },
  processing: {
    label: "Procesando",
    color: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  },
  shipped: {
    label: "Despachado",
    color: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  },
  delivered: {
    label: "Entregado",
    color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-500/10 text-red-300 border-red-500/30",
  },
};

export default function CustomerDetails() {
  const statusColor = statusConfig[customer.status as keyof typeof statusConfig].color;
  const statusLabel = statusConfig[customer.status as keyof typeof statusConfig].label;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatDateTime = (dateString: string) => {
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
      <div className="flex items-center gap-4">
        <Link href="/admin/customers">
          <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Clientes</p>
          <h1 className="font-heading text-3xl text-slate-100">Detalles del cliente</h1>
          <p className="text-sm text-slate-400">Revisa la información completa del cliente.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna izquierda - Información principal */}
        <div className="space-y-6 lg:col-span-2">
          {/* Información del cliente */}
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-100">Información del cliente</CardTitle>
                <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback>{customer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">{customer.name}</h2>
                  <Badge variant="outline" className={statusColor}>
                    {statusLabel}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Mail className="h-4 w-4 text-slate-500" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Phone className="h-4 w-4 text-slate-500" />
                    {customer.phone}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    Cliente desde: {formatDate(customer.joinDate)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <ShoppingBag className="h-4 w-4 text-slate-500" />
                    Último pedido: {formatDate(customer.lastOrder)}
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total gastado</p>
                  <p className="text-2xl font-bold text-emerald-300">
                    {formatCurrency(customer.totalSpent, "CLP")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total de pedidos</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {formatNumber(customer.totalOrders)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direcciones */}
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Direcciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.addresses.map((address) => (
                <div key={address.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">{address.fullName}</p>
                        <p className="text-sm text-slate-300">{address.street}</p>
                        <p className="text-sm text-slate-300">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-sm text-slate-300">{address.country}</p>
                      </div>
                    </div>
                    {address.isDefault && (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                        Predeterminada
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Métodos de pago */}
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Métodos de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-slate-300">
                        {method.brand.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-100 capitalize">{method.brand}</p>
                      <p className="text-sm text-slate-300">
                        •••• •••• •••• {method.last4}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      Exp: {method.expMonth}/{method.expYear}
                    </p>
                    {method.isDefault && (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                        Predeterminado
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Pedidos recientes */}
        <div className="space-y-6">
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Pedidos recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.recentOrders.map((order) => {
                  const orderStatusColor = orderStatusConfig[order.status as keyof typeof orderStatusConfig].color;
                  const orderStatusLabel = orderStatusConfig[order.status as keyof typeof orderStatusConfig].label;

                  return (
                    <div key={order.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-100">{order.id}</p>
                          <p className="text-sm text-slate-300">
                            {formatDateTime(order.date)}
                          </p>
                          <p className="text-sm text-slate-300">
                            {order.items} {order.items === 1 ? "producto" : "productos"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-100">
                            {formatCurrency(order.total, "CLP")}
                          </p>
                          <Badge variant="outline" className={orderStatusColor}>
                            {orderStatusLabel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800">
                  Ver todos los pedidos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
