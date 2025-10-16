"use client";

import { useState, useEffect } from "react";
import { CreditCard, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AccountPaymentsPage() {
  const [user, setUser] = useState<any>(null);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [newCardBrand, setNewCardBrand] = useState("");
  const [newCardLast4, setNewCardLast4] = useState("");
  const [newCardExpMonth, setNewCardExpMonth] = useState("");
  const [newCardExpYear, setNewCardExpYear] = useState("");

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

  return (
    <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-slate-100">Métodos de pago</h1>
        <Button
          onClick={() => setAddCardOpen(true)}
          className="inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Agregar tarjeta
        </Button>
      </div>

      <div className="space-y-4">
        {user?.paymentMethods && user.paymentMethods.length > 0 ? (
          user.paymentMethods.map((card: any) => (
            <div
              key={card.id}
              className="flex items-center justify-between rounded-2xl border border-slate-900/70 bg-slate-950/60 p-4"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-heading text-lg text-slate-100">
                    {card.brand} terminada en {card.last4}
                  </p>
                  <p className="text-xs text-slate-500">
                    Expira {card.expMonth}/{card.expYear}
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  await fetch(`/api/account/cards/${card.id}`, { method: "DELETE" });
                  setUser((u: any) => ({
                    ...u,
                    paymentMethods: u.paymentMethods.filter((c: any) => c.id !== card.id),
                  }));
                }}
                className="text-xs text-red-400 hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-6 text-center text-slate-500">
            No tienes tarjetas guardadas
          </div>
        )}
      </div>

      <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="rounded-2xl bg-slate-950 p-8 w-full max-w-md">
            <h3 className="font-heading text-lg mb-4 text-slate-100">
              Agregar nueva tarjeta
            </h3>
            <div className="mb-4 grid gap-2">
              <Input
                placeholder="Marca (Visa, Mastercard...)"
                value={newCardBrand}
                onChange={(e) => setNewCardBrand(e.target.value)}
              />
              <Input
                placeholder="Últimos 4 dígitos"
                value={newCardLast4}
                onChange={(e) => setNewCardLast4(e.target.value)}
              />
              <Input
                placeholder="Mes de expiración (MM)"
                value={newCardExpMonth}
                onChange={(e) => setNewCardExpMonth(e.target.value)}
              />
              <Input
                placeholder="Año de expiración (YYYY)"
                value={newCardExpYear}
                onChange={(e) => setNewCardExpYear(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={() => setAddCardOpen(false)}>
                Cancelar
              </Button>
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
              >
                Agregar
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}