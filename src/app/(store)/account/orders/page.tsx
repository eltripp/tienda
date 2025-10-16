import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const orders = [
  { id: "TN-9204", total: 1859000, status: "En ruta", date: "08 de octubre 2025" },
  { id: "TN-9188", total: 429900, status: "Entregado", date: "22 de septiembre 2025" },
];

export default function AccountOrdersPage() {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-900/70 bg-slate-950/60 p-4"
        >
          <div>
            <p className="font-heading text-lg text-slate-100">{order.id}</p>
            <p className="text-xs text-slate-500">{order.date}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-emerald-300">{formatCurrency(order.total, "CLP")}</p>
            <Badge className="rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-200">
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
