"use client";

import { useEffect, useState } from "react";
import { AccountNav } from "@/components/account/account-nav";
import Link from "next/link";
import { CreditCard, ShoppingBag, User2, Pencil } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [newCardBrand, setNewCardBrand] = useState("");
  const [newCardLast4, setNewCardLast4] = useState("");
  const [newCardExpMonth, setNewCardExpMonth] = useState("");
  const [newCardExpYear, setNewCardExpYear] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/account", {
          credentials: "include", // Incluir cookies de sesión
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            // Redirigir a login si no está autenticado
            window.location.href = "/auth/sign-in?callbackUrl=" + encodeURIComponent("/account");
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.error) {
          console.error("API error:", data.error);
          return;
        }
        setUser(data);
        setEditName(data.name ?? "");
        setEditEmail(data.email ?? "");
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleEdit = () => setEditOpen(true);
  const handleClose = () => setEditOpen(false);
  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, email: editEmail }),
    });
  setUser((u: any) => u ? { ...u, name: editName, email: editEmail } : u);
    setSaving(false);
    setEditOpen(false);
  };

  return (
    <div className="mx-auto max-w-4xl py-12 px-4 sm:px-8">
      <AccountNav />
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Datos personales */}
        <div className="rounded-2xl border border-slate-900/70 bg-slate-950/70 p-6">
          <div className="flex items-center gap-3 mb-4">
            <User2 className="h-5 w-5 text-emerald-400" />
            <h2 className="font-heading text-xl text-slate-100">Datos personales</h2>
          </div>
          {user ? (
            <div className="mb-2 text-slate-400">
              <div><span className="font-semibold text-slate-200">Nombre:</span> {user.name}</div>
              <div><span className="font-semibold text-slate-200">Correo:</span> {user.email}</div>
            </div>
          ) : (
            <div className="text-slate-500">Cargando...</div>
          )}
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            <Pencil className="h-4 w-4" /> Editar datos
          </button>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="rounded-2xl bg-slate-950 p-8 w-full max-w-md">
                <h3 className="font-heading text-lg mb-4 text-slate-100">Editar datos personales</h3>
                <div className="mb-4">
                  <label className="block text-slate-300 mb-1">Nombre</label>
                  <Input value={editName} onChange={e => setEditName(e.target.value)} className="mb-2" />
                  <label className="block text-slate-300 mb-1">Correo</label>
                  <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <Button variant="outline" onClick={handleClose}>Cancelar</Button>
                  <Button onClick={handleSave} disabled={saving} className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400">
                    {saving ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>
        </div>
        {/* Tarjetas guardadas */}
        <div className="rounded-2xl border border-slate-900/70 bg-slate-950/70 p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-emerald-400" />
            <h2 className="font-heading text-xl text-slate-100">Tarjetas guardadas</h2>
          </div>
          <p className="text-slate-400 mb-2">Gestiona tus métodos de pago y agrega nuevas tarjetas.</p>
          {user && user.paymentMethods && user.paymentMethods.length > 0 ? (
            <ul className="mb-4 space-y-2">
              {user.paymentMethods.map((card: any) => (
                <li key={card.id} className="flex items-center justify-between rounded-xl bg-slate-900/40 px-4 py-2">
                  <div>
                    <span className="font-semibold text-slate-200">{card.brand ?? "Tarjeta"}</span>
                    <span className="ml-2 text-slate-400">•••• {card.last4}</span>
                    <span className="ml-2 text-xs text-slate-500">{card.expMonth}/{card.expYear}</span>
                  </div>
                  <button
                    className="text-xs text-red-400 hover:underline"
                    onClick={async () => {
                      await fetch(`/api/account/cards/${card.id}`, { method: "DELETE" });
                      setUser((u: any) => ({ ...u, paymentMethods: u.paymentMethods.filter((c: any) => c.id !== card.id) }));
                    }}
                  >Eliminar</button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-slate-500 mb-4">No tienes tarjetas guardadas.</div>
          )}
          <button
            onClick={() => setAddCardOpen(true)}
            className="inline-block rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >Agregar tarjeta</button>
          <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="rounded-2xl bg-slate-950 p-8 w-full max-w-md">
                <h3 className="font-heading text-lg mb-4 text-slate-100">Agregar nueva tarjeta</h3>
                <div className="mb-4 grid gap-2">
                  <Input placeholder="Marca (Visa, Mastercard...)" value={newCardBrand} onChange={e => setNewCardBrand(e.target.value)} />
                  <Input placeholder="Últimos 4 dígitos" value={newCardLast4} onChange={e => setNewCardLast4(e.target.value)} />
                  <Input placeholder="Mes de expiración (MM)" value={newCardExpMonth} onChange={e => setNewCardExpMonth(e.target.value)} />
                  <Input placeholder="Año de expiración (YYYY)" value={newCardExpYear} onChange={e => setNewCardExpYear(e.target.value)} />
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <Button variant="outline" onClick={() => setAddCardOpen(false)}>Cancelar</Button>
                  <Button
                    onClick={async () => {
                      await fetch("/api/account/cards", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          brand: newCardBrand,
                          last4: newCardLast4,
                          expMonth: newCardExpMonth,
                          expYear: newCardExpYear,
                        }),
                      });
                      setUser((u: any) => ({
                        ...u,
                        paymentMethods: [
                          ...u.paymentMethods,
                          {
                            id: Math.random().toString(36).slice(2),
                            brand: newCardBrand,
                            last4: newCardLast4,
                            expMonth: newCardExpMonth,
                            expYear: newCardExpYear,
                          },
                        ],
                      }));
                      setAddCardOpen(false);
                      setNewCardBrand("");
                      setNewCardLast4("");
                      setNewCardExpMonth("");
                      setNewCardExpYear("");
                    }}
                    className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                  >Agregar</Button>
                </div>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
      {/* Historial de compras */}
      <div className="mt-12 rounded-2xl border border-slate-900/70 bg-slate-950/70 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingBag className="h-5 w-5 text-emerald-400" />
          <h2 className="font-heading text-xl text-slate-100">Historial de compras</h2>
        </div>
        <p className="text-slate-400 mb-4">Aquí verás tus pedidos realizados y su estado.</p>
        {user && user.orders && user.orders.length > 0 ? (
          <div className="space-y-6">
            {user.orders.map((order: any) => (
              <div key={order.id} className="rounded-xl border border-slate-900/60 bg-slate-900/40 p-4">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold text-slate-200">Pedido #{order.orderNumber}</span>
                    <span className="ml-2 text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-700/30 text-emerald-300 text-xs font-semibold">{order.status}</span>
                </div>
                <div className="mb-2 text-slate-300">Total: <span className="font-bold">${order.total}</span></div>
                <div className="mb-2 text-slate-400 text-sm">{order.items.length} producto(s):</div>
                <ul className="mb-2 text-slate-400 text-sm list-disc pl-5">
                  {order.items.map((item: any) => (
                    <li key={item.id}>
                      {item.product?.name ?? "Producto"} x{item.quantity} <span className="text-slate-500">(${item.unitPrice} c/u)</span>
                    </li>
                  ))}
                </ul>
                {order.notes && <div className="text-xs text-slate-500">{order.notes}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-900/60 bg-slate-900/40 p-4 text-center text-slate-500">
            No tienes compras registradas aún.
          </div>
        )}
      </div>
    </div>
  );
}
