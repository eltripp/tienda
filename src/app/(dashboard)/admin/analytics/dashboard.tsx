import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  PackageOpen,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

// Datos de ejemplo - en una app real estos vendrían de la API
const salesData = [
  { name: "Ene", value: 40000 },
  { name: "Feb", value: 30000 },
  { name: "Mar", value: 50000 },
  { name: "Abr", value: 45000 },
  { name: "May", value: 60000 },
  { name: "Jun", value: 55000 },
];

const ordersData = [
  { name: "Ene", value: 120 },
  { name: "Feb", value: 98 },
  { name: "Mar", value: 145 },
  { name: "Abr", value: 130 },
  { name: "May", value: 168 },
  { name: "Jun", value: 155 },
];

const topProducts = [
  { 
    name: "MacBook Pro 14"", 
    sku: "MBP-14-2023", 
    sales: 45, 
    revenue: 45990000,
    change: 12.5
  },
  { 
    name: "iPhone 15 Pro", 
    sku: "IP15P-128", 
    sales: 82, 
    revenue: 65990000,
    change: -5.2
  },
  { 
    name: "AirPods Pro", 
    sku: "APP-2ND", 
    sales: 127, 
    revenue: 25390000,
    change: 8.7
  },
  { 
    name: "iPad Air", 
    sku: "IPA-5TH", 
    sales: 34, 
    revenue: 18990000,
    change: 0
  },
  { 
    name: "Apple Watch Series 9", 
    sku: "AWS9-45MM", 
    sales: 58, 
    revenue: 22990000,
    change: 15.3
  },
];

const topCategories = [
  { name: "Laptops", value: 35, change: 5.2 },
  { name: "Smartphones", value: 28, change: -2.1 },
  { name: "Audio", value: 18, change: 8.7 },
  { name: "Tablets", value: 12, change: 0.5 },
  { name: "Wearables", value: 7, change: 12.3 },
];

const recentTransactions = [
  { 
    id: "TN-9204", 
    customer: "Constanza Rojas", 
    amount: 1859000, 
    date: "2023-10-28T14:30:00Z",
    status: "completed"
  },
  { 
    id: "TN-9203", 
    customer: "Ignacio Díaz", 
    amount: 1299900, 
    date: "2023-10-28T11:15:00Z",
    status: "completed"
  },
  { 
    id: "TN-9202", 
    customer: "Kibernum", 
    amount: 8599000, 
    date: "2023-10-27T16:45:00Z",
    status: "completed"
  },
  { 
    id: "TN-9201", 
    customer: "María González", 
    amount: 549900, 
    date: "2023-10-27T09:20:00Z",
    status: "pending"
  },
];

export default function AdminAnalyticsDashboard() {
  const stats = [
    {
      title: "Ventas del mes",
      value: formatCurrency(45678900, "CLP"),
      change: 12.5,
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Pedidos",
      value: "284",
      change: 8.2,
      icon: ShoppingCart,
      color: "text-blue-500",
    },
    {
      title: "Clientes",
      value: "1,842",
      change: 18.7,
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Productos",
      value: "156",
      change: 2.3,
      icon: PackageOpen,
      color: "text-orange-500",
    },
  ];

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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Insights</p>
        <h1 className="font-heading text-3xl text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400">Visualiza tendencias de ventas, tickets y recurrencia.</p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-900/70 bg-slate-950/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
              <p className="text-xs text-slate-500 flex items-center">
                {stat.change > 0 ? (
                  <>
                    <ArrowUp className="mr-1 h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">+{stat.change}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="mr-1 h-3 w-3 text-red-400" />
                    <span className="text-red-400">{stat.change}%</span>
                  </>
                )}
                {" "}respecto al mes anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos y tablas */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-900/50">
          <TabsTrigger value="sales" className="data-[state=active]:bg-slate-800">Ventas</TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-slate-800">Productos</TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-slate-800">Categorías</TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-slate-800">Transacciones</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Gráfico de ventas */}
            <Card className="border-slate-900/70 bg-slate-950/60 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Ventas mensuales (MM CLP)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-64 items-end gap-2">
                  {salesData.map((item) => (
                    <div key={item.name} className="flex flex-1 flex-col justify-end">
                      <div
                        className="rounded-t-2xl bg-gradient-to-t from-emerald-500/30 to-sky-500/40"
                        style={{ height: `${(item.value / 60000) * 200}px` }}
                      />
                      <p className="mt-2 text-center text-xs text-slate-500">{item.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de pedidos */}
            <Card className="border-slate-900/70 bg-slate-950/60 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">Pedidos mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-64 items-end gap-2">
                  {ordersData.map((item) => (
                    <div key={item.name} className="flex flex-1 flex-col justify-end">
                      <div
                        className="rounded-t-2xl bg-gradient-to-t from-blue-500/30 to-purple-500/40"
                        style={{ height: `${(item.value / 180) * 200}px` }}
                      />
                      <p className="mt-2 text-center text-xs text-slate-500">{item.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Productos más vendidos</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                    <th className="pb-3 font-medium">Producto</th>
                    <th className="pb-3 font-medium">SKU</th>
                    <th className="pb-3 font-medium text-right">Unidades</th>
                    <th className="pb-3 font-medium text-right">Ingresos</th>
                    <th className="pb-3 font-medium text-right">Cambio</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.sku} className="border-b border-slate-800 text-sm text-slate-300">
                      <td className="py-3 font-medium">{product.name}</td>
                      <td className="py-3">{product.sku}</td>
                      <td className="py-3 text-right">{product.sales}</td>
                      <td className="py-3 text-right">{formatCurrency(product.revenue, "CLP")}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end">
                          {product.change > 0 ? (
                            <>
                              <ArrowUp className="mr-1 h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">+{product.change}%</span>
                            </>
                          ) : product.change < 0 ? (
                            <>
                              <ArrowDown className="mr-1 h-3 w-3 text-red-400" />
                              <span className="text-red-400">{product.change}%</span>
                            </>
                          ) : (
                            <span className="text-slate-500">0%</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Categorías más populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <PackageOpen className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">{category.name}</p>
                        <p className="text-xs text-slate-500">{category.value}% del total</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {category.change > 0 ? (
                        <>
                          <ArrowUp className="mr-1 h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">+{category.change}%</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown className="mr-1 h-3 w-3 text-red-400" />
                          <span className="text-red-400">{category.change}%</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Transacciones recientes</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Fecha</th>
                    <th className="pb-3 font-medium text-right">Monto</th>
                    <th className="pb-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-800 text-sm text-slate-300">
                      <td className="py-3 font-medium">{transaction.id}</td>
                      <td className="py-3">{transaction.customer}</td>
                      <td className="py-3">{formatDateTime(transaction.date)}</td>
                      <td className="py-3 text-right">{formatCurrency(transaction.amount, "CLP")}</td>
                      <td className="py-3">
                        <Badge
                          variant={transaction.status === "completed" ? "default" : "destructive"}
                          className={
                            transaction.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                              : "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
                          }
                        >
                          {transaction.status === "completed" ? "Completada" : "Pendiente"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
