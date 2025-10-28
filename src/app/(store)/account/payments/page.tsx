"use client";

import { useState, useEffect } from "react";
import { AccountNav } from "@/components/account/account-nav";
import { CreditCard, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AccountPaymentsPage() {
  const [user, setUser] = useState<any>(null);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Asegurarse de que el diálogo para agregar tarjeta no se muestre automáticamente
  useEffect(() => {
    // Marcar que el componente está montado
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  // Asegurarse de que el diálogo esté cerrado cuando el componente está montado
  useEffect(() => {
    if (mounted) {
      setAddCardOpen(false);
    }
  }, [mounted]);
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

  const handleAddCard = () => {
    setNewCardBrand("");
    setNewCardLast4("");
    setNewCardExpMonth("");
    setNewCardExpYear("");
    setAddCardOpen(true);
  };

  const handleSaveCard = () => {
    setUser((u: any) => ({
      ...u,
      paymentMethods: [
        ...(u.paymentMethods || []),
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
  };

    return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-slate-100">Métodos de pago</h1>
        <button
          onClick={handleAddCard}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" /> Agregar tarjeta
        </button>
      </div>

      {user && user.paymentMethods && user.paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {user.paymentMethods.map((card: any) => (
            <div
              key={card.id}
              className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-200 capitalize">{card.brand}</div>
                    <div className="text-slate-400">•••• •••• •••• {card.last4}</div>
                  </div>
                </div>
                <div className="text-slate-400 text-sm">
                  {card.expMonth}/{card.expYear}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-6 text-center text-slate-500">
          No tienes métodos de pago guardados.
        </div>
      )}

      {/* Diálogo para agregar tarjeta */}
      <Dialog open={mounted ? addCardOpen : false} onOpenChange={setAddCardOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar nueva tarjeta</DialogTitle>
          </DialogHeader>
          <div className="mb-4 grid gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Marca de la tarjeta</label>
              <Input
                placeholder="Visa, Mastercard, etc."
                value={newCardBrand}
                onChange={(e) => setNewCardBrand(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Últimos 4 dígitos</label>
              <Input
                placeholder="1234"
                value={newCardLast4}
                onChange={(e) => setNewCardLast4(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Mes de expiración</label>
                <Input
                  placeholder="MM"
                  value={newCardExpMonth}
                  onChange={(e) => setNewCardExpMonth(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Año de expiración</label>
                <Input
                  placeholder="YY"
                  value={newCardExpYear}
                  onChange={(e) => setNewCardExpYear(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCardOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleSaveCard}
              className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
            >
              Agregar tarjeta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
