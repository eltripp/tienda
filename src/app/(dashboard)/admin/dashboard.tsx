import { BarChart3, PackageOpen, ShoppingCart, TrendingUp, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  // Obtener datos reales de la base de datos
  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue,
    recentOrders,
    topProducts
  ] = await Promise.all([
    // Total de productos
    prisma.product.count({
      where: { isActive: true }
    }),
    
    // Total de órdenes
    prisma.order.count(),
    
    // Total de clientes
    prisma.user.count({
      where: { role: "USER" }
    }),
    
    // Ingresos totales
    prisma.order.aggregate({
      _sum: { total: true }
    }),
    
    // Órdenes recientes
    prisma.order.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    }),
    
    // Productos más vendidos (simulado)
    prisma.product.findMany({
      take: 3,
      where: { isActive: true },
      orderBy: {
        // Si tienes un campo de ventas, úsalo aquí
        // sales: "desc"
        name: "asc" // Temporalmente ordenado por nombre
      }
    })
  ]);
  
  // Calcular estadísticas
  const stats = [
    {
      title: "Ventas totales",
      value: formatCurrency(totalRevenue._sum.total || 0, "CLP"),
      change: "+12.5%", // TODO: Calcular cambio real comparando con el mes anterior
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Pedidos",
      value: totalOrders.toString(),
      change: "+8.2%", // TODO: Calcular cambio real comparando con el mes anterior
      icon: ShoppingCart,
      color: "text-blue-500",
    },
    {
      title: "Clientes",
      value: totalCustomers.toString(),
      change: "+18.7%", // TODO: Calcular cambio real comparando con el mes anterior
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Productos",
      value: totalProducts.toString(),
      change: "+2.3%", // TODO: Calcular cambio real comparando con el mes anterior
      icon: PackageOpen,
      color: "text-orange-500",
    },
  ];

  const recentOrdersData = recentOrders.map(order => ({
    id: `TN-${order.id}`,
    customer: order.user?.name || "Cliente desconocido",
    total: order.total,
    status: order.status || "Procesando",
    date: new Date(order.createdAt).toLocaleDateString("es-CL", { 
      day: "numeric", 
      month: "short", 
      hour: "2-digit", 
      minute: "2-digit" 
    })
  }));

  const topProductsData = topProducts.map(product => ({
    name: product.name,
    sku: product.sku || "N/A",
    sales: 0, // TODO: Implementar contador de ventas reales
    revenue: 0 // TODO: Implementar cálculo de ingresos reales
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Panel de control</p>
        <h1 className="font-heading text-3xl text-slate-100">Resumen</h1>
        <p className="text-sm text-slate-400">Monitorea el rendimiento general de tu tienda.</p>
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
              <p className="text-xs text-slate-500">
                <span className="text-emerald-400">{stat.change}</span> respecto al mes anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pedidos recientes */}
        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-lg text-slate-100">Pedidos recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrdersData.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-100">{order.id}</p>
                  <p className="text-sm text-slate-400">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-100">{formatCurrency(order.total, "CLP")}</p>
                  <p className="text-xs text-slate-500">{order.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Productos más vendidos */}
        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-lg text-slate-100">Productos más vendidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProductsData.map((product) => (
              <div key={product.sku} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-100">{product.name}</p>
                  <p className="text-sm text-slate-400">{product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-100">{product.sales} unidades</p>
                  <p className="text-xs text-slate-500">{formatCurrency(product.revenue, "CLP")}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
