import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const orders = [
  { id: "TN-9204", customer: "Constanza Rojas", total: 1859000, status: "Despachado", date: "Hace 2 horas" },
  { id: "TN-9203", customer: "Ignacio Díaz", total: 1299900, status: "Preparando", date: "Hace 5 horas" },
  { id: "TN-9202", customer: "Kibernum", total: 8599000, status: "Pago verificado", date: "Ayer" },
];

export default function AdminOrdersPage() {
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
                {order.id}
                <Badge className="rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300">
                  {order.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <p className="font-medium text-slate-200">{order.customer}</p>
              <p>{order.date}</p>
              <p className="text-emerald-300">{formatCurrency(order.total, "CLP")}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
