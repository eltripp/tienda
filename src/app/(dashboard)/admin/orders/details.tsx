import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, MapPin, CreditCard, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

// Datos de ejemplo - en una app real estos vendrían de la API
const order = {
  id: "TN-9204",
  status: "shipped",
  placedAt: "2023-10-28T14:30:00Z",
  subtotal: 1699000,
  shippingTotal: 100000,
  taxTotal: 160000,
  discountTotal: 0,
  total: 1859000,
  paymentStatus: "paid",
  paymentMethod: {
    brand: "Visa",
    last4: "4242",
  },
  customer: {
    name: "Constanza Rojas",
    email: "constanza@example.com",
    phone: "+56 9 1234 5678",
  },
  shippingAddress: {
    fullName: "Constanza Rojas",
    street: "Av. Providencia 1234",
    city: "Santiago",
    state: "Región Metropolitana",
    postalCode: "7500000",
    country: "Chile",
  },
  items: [
    {
      id: "1",
      name: "MacBook Pro 14"",
      sku: "MBP-14-2023",
      price: 1299900,
      quantity: 1,
      image: "/placeholder-product.jpg",
    },
    {
      id: "2",
      name: "AirPods Pro",
      sku: "APP-2ND",
      price: 299900,
      quantity: 1,
      image: "/placeholder-product.jpg",
    },
    {
      id: "3",
      name: "Magic Mouse",
      sku: "MM-2ND",
      price: 99900,
      quantity: 1,
      image: "/placeholder-product.jpg",
    },
  ],
  tracking: {
    number: "1234567890",
    carrier: "Chilexpress",
    status: "En tránsito",
    estimatedDelivery: "2023-10-30",
  },
};

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

export default function OrderDetails() {
  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
  const statusColor = statusConfig[order.status as keyof typeof statusConfig].color;
  const statusLabel = statusConfig[order.status as keyof typeof statusConfig].label;

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
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Logística</p>
          <h1 className="font-heading text-3xl text-slate-100">Detalles del pedido</h1>
          <p className="text-sm text-slate-400">Revisa la información completa del pedido.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna izquierda - Información del pedido */}
        <div className="space-y-6 lg:col-span-2">
          {/* Estado y seguimiento */}
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-100">Estado del pedido</CardTitle>
                <Badge variant="outline" className={statusColor}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {statusLabel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Número de pedido</p>
                  <p className="font-medium text-slate-100">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Fecha</p>
                  <p className="font-medium text-slate-100">{formatDate(order.placedAt)}</p>
                </div>
              </div>

              {order.tracking && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-100">Seguimiento</p>
                    <p className="text-xs text-slate-500">{order.tracking.carrier}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm text-slate-300">{order.tracking.number}</p>
                    <p className="text-xs text-slate-500">
                      Entrega estimada: {order.tracking.estimatedDelivery}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Productos del pedido */}
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-md bg-slate-800 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-100 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-100">{formatCurrency(item.price, "CLP")}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4 bg-slate-800" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-slate-300">{formatCurrency(order.subtotal, "CLP")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Envío</span>
                  <span className="text-slate-300">{formatCurrency(order.shippingTotal, "CLP")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Impuestos</span>
                  <span className="text-slate-300">{formatCurrency(order.taxTotal, "CLP")}</span>
                </div>
                {order.discountTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Descuento</span>
                    <span className="text-emerald-300">-{formatCurrency(order.discountTotal, "CLP")}</span>
                  </div>
                )}
                <Separator className="my-2 bg-slate-800" />
                <div className="flex justify-between">
                  <span className="font-medium text-slate-100">Total</span>
                  <span className="font-bold text-lg text-slate-100">{formatCurrency(order.total, "CLP")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Información del cliente y dirección */}
        <div className="space-y-6">
          {/* Información del cliente */}
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Información del cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-100">{order.customer.name}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Mail className="h-4 w-4 text-slate-500" />
                  {order.customer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Phone className="h-4 w-4 text-slate-500" />
                  {order.customer.phone}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dirección de envío */}
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Dirección de envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-100">{order.shippingAddress.fullName}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-slate-300">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Información de pago */}
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Información de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-100">
                    {order.paymentMethod.brand} •••• {order.paymentMethod.last4}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      order.paymentStatus === "paid"
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        : "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
                    }
                  >
                    {order.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {order.status === "pending" && (
                  <Button className="w-full bg-blue-500 text-blue-950 hover:bg-blue-400">
                    <Package className="mr-2 h-4 w-4" />
                    Marcar como procesando
                  </Button>
                )}
                {order.status === "processing" && (
                  <Button className="w-full bg-purple-500 text-purple-950 hover:bg-purple-400">
                    <Truck className="mr-2 h-4 w-4" />
                    Marcar como despachado
                  </Button>
                )}
                {order.status === "shipped" && (
                  <Button className="w-full bg-emerald-500 text-emerald-950 hover:bg-emerald-400">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marcar como entregado
                  </Button>
                )}
                {order.status !== "cancelled" && order.status !== "delivered" && (
                  <Button variant="outline" className="w-full border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelar pedido
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
