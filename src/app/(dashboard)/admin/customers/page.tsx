import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

const customers = [
  { name: "Danilo Andrade", email: "danilo@technova.dev", lifetimeValue: 4689000, orders: 12 },
  { name: "Sofía Contreras", email: "sofia@innovacorp.cl", lifetimeValue: 2845000, orders: 8 },
  { name: "Kibernum", email: "compras@kibernum.com", lifetimeValue: 18999000, orders: 32 },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Clientes</p>
        <h1 className="font-heading text-3xl text-slate-100">Relaciones</h1>
        <p className="text-sm text-slate-400">Identifica clientes frecuentes y oportunidades de fidelización.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => (
          <Card key={customer.email} className="border-slate-900/70 bg-slate-950/60">
            <CardHeader className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://avatar.vercel.sh/${encodeURIComponent(customer.email)}`} />
                <AvatarFallback>{customer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg text-slate-100">{customer.name}</CardTitle>
                <p className="text-xs text-slate-500">{customer.email}</p>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Valor acumulado</p>
                <p className="text-base font-semibold text-emerald-300">${formatNumber(customer.lifetimeValue)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pedidos</p>
                <p className="text-base font-semibold text-slate-100">{customer.orders}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
