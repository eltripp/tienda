import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Obtener datos reales de la base de datos
  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue,
    recentOrders,
    topCustomers
  ] = await Promise.all([
    // Total de productos
    prisma.product.count({
      where: { isActive: true }
    }),

    // Total de órdenes
    prisma.order.count(),

    // Total de clientes
    prisma.user.count({
      where: { role: "CUSTOMER" }
    }),

    // Ingresos totales
    prisma.order.aggregate({
      _sum: { total: true },
      where: { 
        status: { 
          in: ["COMPLETED", "SHIPPED"] 
        } 
      }
    }),

    // Órdenes recientes
    prisma.order.findMany({
      take: 5,
      orderBy: { placedAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }),

    // Clientes con mayor valor de vida útil (lifetime value)
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        _count: {
          select: { orders: true }
        },
        orders: {
          select: {
            total: true
          }
        }
      }
    })
  ]);

  // Calcular el valor de vida útil de cada cliente
  const customersWithLifetimeValue = topCustomers.map(customer => ({
    ...customer,
    lifetimeValue: customer.orders.reduce((sum, order) => sum + order.total, 0)
  }));

  // Ordenar clientes por valor de vida útil (mayor a menor) y tomar los primeros 5
  customersWithLifetimeValue.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  customersWithLifetimeValue.splice(5); // Mantener solo los primeros 5

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Dashboard</h1>
        <p className="text-muted-foreground text-slate-400">
          Bienvenido al panel de administración
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-slate-950/60 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/60 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de órdenes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/60 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/60 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue._sum.total || 0, "CLP")}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-800 bg-slate-950/60 text-slate-100">
          <CardHeader>
            <CardTitle>Órdenes recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{`TN-${order.orderNumber}`}</p>
                    <p className="text-sm text-slate-400">
                      {order.user?.name || order.user?.email || "Cliente invitado"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total, "CLP")}</p>
                    <p className="text-sm text-slate-400">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/60 text-slate-100">
          <CardHeader>
            <CardTitle>Clientes destacados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customersWithLifetimeValue.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{customer.name || customer.email}</p>
                    <p className="text-sm text-slate-400">{customer._count.orders} pedidos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(customer.lifetimeValue, "CLP")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
