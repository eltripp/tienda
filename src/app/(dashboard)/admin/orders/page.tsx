import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

// Función para traducir el estado del pedido a español
function getStatusText(status: string): string {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "PROCESSING":
      return "Procesando";
    case "COMPLETED":
      return "Completado";
    case "SHIPPED":
      return "Despachado";
    case "CANCELLED":
      return "Cancelado";
    case "REFUNDED":
      return "Reembolsado";
    default:
      return status;
  }
}

// Función para obtener el color de la insignia según el estado
function getStatusBadgeColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "rounded-full border border-yellow-500/30 bg-yellow-500/10 text-xs text-yellow-300";
    case "PROCESSING":
      return "rounded-full border border-blue-500/30 bg-blue-500/10 text-xs text-blue-300";
    case "COMPLETED":
      return "rounded-full border border-green-500/30 bg-green-500/10 text-xs text-green-300";
    case "SHIPPED":
      return "rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300";
    case "CANCELLED":
      return "rounded-full border border-red-500/30 bg-red-500/10 text-xs text-red-300";
    case "REFUNDED":
      return "rounded-full border border-orange-500/30 bg-orange-500/10 text-xs text-orange-300";
    default:
      return "rounded-full border border-slate-500/30 bg-slate-500/10 text-xs text-slate-300";
  }
}

// Función para formatear la fecha de manera relativa
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) {
    return "Hace unos minutos";
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;
  } else {
    return date.toLocaleDateString("es-CL");
  }
}

export default async function AdminOrdersPage() {
  // Obtener pedidos reales de la base de datos
  const orders = await prisma.order.findMany({
    orderBy: { placedAt: "desc" },
    take: 50, // Limitar a los 50 pedidos más recientes
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Logística</p>
        <h1 className="font-heading text-3xl text-slate-100">Pedidos</h1>
        <p className="text-sm text-slate-400">Monitorea entregas críticas y SLA de despacho.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id} className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base text-slate-100">
                {`TN-${order.orderNumber}`}
                <Badge className={getStatusBadgeColor(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <p className="font-medium text-slate-200">
                {order.user?.name || order.user?.email || "Cliente invitado"}
              </p>
              <p>{getRelativeTime(order.placedAt)}</p>
              <p className="text-emerald-300">{formatCurrency(order.total, "CLP")}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
