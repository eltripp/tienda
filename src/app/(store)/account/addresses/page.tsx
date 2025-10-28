"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AccountAddressesPage() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Estados para direcciones
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
  });
  const [editAddress, setEditAddress] = useState({
    id: "",
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
  });

  // Asegurarse de que el componente está montado
  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  // Asegurarse de que los diálogos estén cerrados cuando el componente está montado
  useEffect(() => {
    if (mounted) {
      setAddAddressOpen(false);
      setEditAddressOpen(false);
    }
  }, [mounted]);

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

  // Funciones para direcciones
  const handleAddAddress = () => {
    setNewAddress({
      fullName: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      isDefault: false,
    });
    setAddAddressOpen(true);
  };

  const handleEditAddress = (address: any) => {
    setSelectedAddress(address);
    setEditAddress({
      id: address.id,
      fullName: address.fullName,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setEditAddressOpen(true);
  };

  const handleSaveAddress = async () => {
    await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddress),
    });
    setUser((u: any) => ({
      ...u,
      addresses: [
        ...(u.addresses || []),
        {
          id: Math.random().toString(36).slice(2),
          ...newAddress,
        },
      ],
    }));
    setAddAddressOpen(false);
    setNewAddress({
      fullName: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      isDefault: false,
    });
  };

  const handleUpdateAddress = async () => {
    await fetch(`/api/account/addresses/${editAddress.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editAddress),
    });
    setUser((u: any) => ({
      ...u,
      addresses: u.addresses.map((a: any) =>
        a.id === editAddress.id ? { ...a, ...editAddress } : a
      ),
    }));
    setEditAddressOpen(false);
    setEditAddress({
      id: "",
      fullName: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      isDefault: false,
    });
  };

  const handleDeleteAddress = async (id: string) => {
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    setUser((u: any) => ({
      ...u,
      addresses: u.addresses.filter((a: any) => a.id !== id),
    }));
  };

    return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-slate-100">Direcciones guardadas</h1>
        <button
          onClick={handleAddAddress}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" /> Agregar dirección
        </button>
      </div>

      {user && user.addresses && user.addresses.length > 0 ? (
        <div className="space-y-4">
          {user.addresses.map((address: any) => (
            <div
              key={address.id}
              className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold text-slate-200">{address.fullName}</span>
                    {address.isDefault && (
                      <span className="px-2 py-1 rounded bg-emerald-700/30 text-emerald-300 text-xs font-semibold">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400">
                    <div>{address.street}</div>
                    <div>
                      {address.city}, {address.state} {address.postalCode}
                    </div>
                    <div>{address.country}</div>
                    <div>Tel: {address.phone}</div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    className="text-slate-400 hover:text-slate-200"
                    onClick={() => handleEditAddress(address)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-6 text-center text-slate-500">
          No tienes direcciones guardadas.
        </div>
      )}

      {/* Diálogo para agregar dirección */}
      <Dialog open={mounted ? addAddressOpen : false} onOpenChange={setAddAddressOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar nueva dirección</DialogTitle>
          </DialogHeader>
          <div className="mb-4 grid gap-3">
            {/* Campos de entrada para nueva dirección */}
            {/* ... (mantén el resto igual) */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAddressOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveAddress}
              className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
            >
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar dirección */}
      <Dialog open={mounted ? editAddressOpen : false} onOpenChange={setEditAddressOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Editar dirección</DialogTitle>
          </DialogHeader>
          <div className="mb-4 grid gap-3">
            {/* Campos de entrada para edición */}
            {/* ... (mantén igual que en tu código) */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAddressOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateAddress}
              className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
