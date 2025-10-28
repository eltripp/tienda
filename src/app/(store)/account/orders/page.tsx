"use client";

import { useState, useEffect } from "react";
import { AccountLayout } from "@/components/account/account-layout";
import { ShoppingBag, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";

type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "SHIPPED" | "CANCELLED" | "REFUNDED";

const statusConfig = {
  PENDING: {
    label: "Pendiente",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  PROCESSING: {
    label: "Procesando",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  COMPLETED: {
    label: "Completado",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  SHIPPED: {
    label: "Enviado",
    icon: Truck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  CANCELLED: {
    label: "Cancelado",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  REFUNDED: {
    label: "Reembolsado",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
};

export default function AccountOrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Asegurarse de que el componente está montado
  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/account");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.error) {
          console.error("API error:", data.error);
          return;
        }
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const getStatusIcon = (status: OrderStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.color}`} />;
  };

  const getStatusLabel = (status: OrderStatus) => {
    return statusConfig[status].label;
  };

  const getStatusColor = (status: OrderStatus) => {
    return statusConfig[status].bgColor;
  };

  const getTrackingSteps = (status: OrderStatus) => {
    // Definir los pasos del seguimiento según el estado actual
    const steps = [
      { id: "order", label: "Pedido recibido", completed: true },
      { id: "processing", label: "Procesando", completed: ["PROCESSING", "COMPLETED", "SHIPPED"].includes(status) },
      { id: "shipped", label: "Enviado", completed: ["COMPLETED", "SHIPPED"].includes(status) },
      { id: "delivered", label: "Entregado", completed: status === "COMPLETED" },
    ];

    // Si el pedido está cancelado o reembolsado, mostrar un estado diferente
    if (["CANCELLED", "REFUNDED"].includes(status)) {
      return [
        { id: "order", label: "Pedido recibido", completed: true },
        { id: "cancelled", label: status === "CANCELLED" ? "Cancelado" : "Reembolsado", completed: true, isNegative: true },
      ];
    }

    return steps;
  };

  return (
    <AccountLayout
      title="Historial de pedidos"
      icon={<ShoppingBag className="h-5 w-5 text-emerald-400" />}
      subtitle="Aquí verás tus pedidos realizados y su estado."
    >

        {user && user.orders && user.orders.length > 0 ? (
          <div className="space-y-6">
            {user.orders.map((order: any) => (
              <div key={order.id} className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-6">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                  <div>
                    <span className="font-semibold text-slate-200">Pedido #{order.orderNumber}</span>
                    <span className="ml-2 text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)} ${statusConfig[order.status as OrderStatus].color}`}>
                    {getStatusLabel(order.status as OrderStatus)}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Total: <span className="font-bold text-slate-100">${order.total}</span></span>
                  </div>
                  <div className="text-slate-400 text-sm">{order.items.length} producto(s)</div>
                </div>

                {/* Seguimiento del pedido */}
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-200 mb-4">Seguimiento del pedido</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-700"></div>
                    <div className="space-y-6">
                      {getTrackingSteps(order.status as OrderStatus).map((step, index) => (
                        <div key={step.id} className="flex items-start gap-4">
                          <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                            step.isNegative ? "bg-red-500/20" : step.completed ? "bg-emerald-500" : "bg-slate-700"
                          }`}>
                            {step.id === "cancelled" ? (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : step.completed ? (
                              <CheckCircle className="h-4 w-4 text-white" />
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${step.completed ? "text-slate-200" : "text-slate-500"}`}>
                              {step.label}
                            </p>
                            {step.id === "shipped" && order.status === "SHIPPED" && (
                              <p className="text-sm text-slate-400 mt-1">
                                Tu pedido está en camino. Recibirás una notificación cuando se entregue.
                              </p>
                            )}
                            {step.id === "delivered" && order.status === "COMPLETED" && (
                              <p className="text-sm text-slate-400 mt-1">
                                Tu pedido ha sido entregado con éxito.
                              </p>
                            )}
                            {step.id === "cancelled" && (
                              <p className="text-sm text-slate-400 mt-1">
                                {order.status === "CANCELLED"
                                  ? "El pedido ha sido cancelado."
                                  : "El pedido ha sido reembolsado."}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Productos del pedido */}
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-200 mb-4">Productos del pedido</h3>
                  <div className="space-y-3">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/40">
                        <div className="h-16 w-16 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
                          {item.product?.imageUrl ? (
                            <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-slate-700 flex items-center justify-center">
                              <Package className="h-6 w-6 text-slate-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-200">{item.product?.name || "Producto"}</h4>
                          <p className="text-sm text-slate-400">Cantidad: {item.quantity}</p>
                          <p className="text-sm text-slate-400">Precio: ${item.unitPrice} c/u</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-200">${item.unitPrice * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notas del pedido */}
                {order.notes && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-200 mb-2">Notas del pedido</h3>
                    <p className="text-sm text-slate-400">{order.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-6 text-center text-slate-500">
            No tienes compras registradas aún.
          </div>
        )}
    </AccountLayout>
  );
}
