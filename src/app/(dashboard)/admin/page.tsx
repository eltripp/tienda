import { CreditCard, PackageCheck, Replay, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function AdminDashboardPage() {
  const metrics = [
    {
      label: "Ingresos (30d)",
      value: formatCurrency(842000, "CLP"),
      change: "+18%",
      icon: CreditCard,
    },
    {
      label: "Pedidos completados",
      value: formatNumber(258),
      change: "+12%",
      icon: PackageCheck,
    },
    {
      label: "Clientes activos",
      value: formatNumber(1240),
      change: "+5%",
      icon: Users,
    },
    {
      label: "Reembolsos",
      value: formatCurrency(82000, "CLP"),
      change: "-6%",
      icon: Replay,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Panel administrativo</p>
        <h1 className="font-heading text-3xl text-slate-100">Resumen general</h1>
        <p className="text-sm text-slate-400">
          Rastrea el rendimiento de ventas, inventario y experiencia del cliente en tiempo real.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-slate-900/70 bg-slate-950/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {metric.label}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-emerald-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-100">{metric.value}</div>
              <p className="text-xs text-emerald-300">{metric.change} respecto al mes anterior</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-slate-900/70 bg-slate-950/60">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg text-slate-100">Actividad reciente</CardTitle>
          <a href="#" className="text-sm text-emerald-300 transition hover:text-emerald-200">
            Ver todo
          </a>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-300">
          <div className="flex items-center justify-between rounded-xl border border-slate-900/60 bg-slate-900/50 p-4">
            <div>
              <p className="font-semibold text-slate-100">Pedido #TN-8421</p>
              <p className="text-xs text-slate-500">MacBook Pro M4 • Cliente: Rodrigo Vega</p>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
              Despachado
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-900/60 bg-slate-900/50 p-4">
            <div>
              <p className="font-semibold text-slate-100">Ticket soporte</p>
              <p className="text-xs text-slate-500">Integración Stripe - Cuenta B2B Kibernum</p>
            </div>
            <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-300">
              En curso
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
