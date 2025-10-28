"use client";

import { useEffect, useState } from "react";
import { AccountNav } from "@/components/account/account-nav";
import Link from "next/link";
import { CreditCard, ShoppingBag, User2, Pencil, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
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

  // Asegurarse de que el diálogo para agregar tarjeta no se muestre automáticamente
  useEffect(() => {
    // Marcar que el componente está montado
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  // Asegurarse de que los diálogos estén cerrados cuando el componente está montado
  useEffect(() => {
    if (mounted) {
      setAddCardOpen(false);
      setAddAddressOpen(false);
      setEditAddressOpen(false);
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
        setEditName(data.name || "");
        setEditEmail(data.email || "");
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.error) {
        console.error("API error:", data.error);
        return;
      }
      setUser({ ...user, name: data.name, email: data.email });
      setEditOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

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
    try {
      const response = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const savedAddress = await response.json();
      
      setUser((u: any) => ({
        ...u,
        addresses: [
          ...(u.addresses || []),
          savedAddress,
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
    } catch (error) {
      console.error("Error al guardar dirección:", error);
    }
  };

  const handleUpdateAddress = async () => {
    try {
      const response = await fetch(`/api/account/addresses/${editAddress.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAddress),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedAddress = await response.json();
      
      setUser((u: any) => ({
        ...u,
        addresses: u.addresses.map((a: any) =>
          a.id === editAddress.id ? updatedAddress : a
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
    } catch (error) {
      console.error("Error al actualizar dirección:", error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const response = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setUser((u: any) => ({
        ...u,
        addresses: u.addresses.filter((a: any) => a.id !== id),
      }));
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-900/70 bg-slate-950/60 p-6 sm:p-10 space-y-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg text-slate-100">Información personal</h2>
                <button
                  onClick={() => setEditOpen(true)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User2 className="h-8 w-8 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-200">{user?.name || "Tu nombre"}</div>
                    <div className="text-slate-400 text-sm">{user?.email || "tu@email.com"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg text-slate-100">Métodos de pago</h2>
                <button
                  onClick={handleAddCard}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {user && user.paymentMethods && user.paymentMethods.length > 0 ? (
                <div className="space-y-3">
                  {user.paymentMethods.map((card: any) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-emerald-400" />
                        <div>
                          <div className="font-medium text-slate-200 capitalize">{card.brand}</div>
                          <div className="text-slate-400 text-sm">•••• •••• •••• {card.last4}</div>
                        </div>
                      </div>
                      <div className="text-slate-400 text-sm">
                        {card.expMonth}/{card.expYear}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-6">
                  No tienes métodos de pago guardados.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg text-slate-100">Direcciones</h2>
                <button
                  onClick={handleAddAddress}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {user && user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-3">
                  {user.addresses.map((address: any) => (
                    <div
                      key={address.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/40 p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-emerald-400" />
                            {address.isDefault && (
                              <span className="px-2 py-0.5 rounded bg-emerald-700/30 text-emerald-300 text-xs font-semibold">Predeterminada</span>
                            )}
                          </div>
                          <div className="text-slate-200">{address.street}</div>
                          <div className="text-slate-400 text-sm">{address.city}, {address.state} {address.zipCode}</div>
                          <div className="text-slate-400 text-sm">{address.country}</div>
                        </div>
                        <div className="flex gap-1 ml-4">
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
                <div className="text-center text-slate-500 py-6">
                  No tienes direcciones guardadas.
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Diálogo para editar perfil */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          <div className="mb-4 grid gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Nombre</label>
              <Input
                placeholder="Tu nombre"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Email</label>
              <Input
                placeholder="tu@email.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Diálogo para agregar dirección */}
      <Dialog open={mounted ? addAddressOpen : false} onOpenChange={setAddAddressOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar nueva dirección</DialogTitle>
          </DialogHeader>
          <div className="mb-4 grid gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Tipo de dirección</label>
              <Input
                placeholder="Ej: Casa, Oficina, Apartamento..."
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Calle</label>
              <Input
                placeholder="Calle y número"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Ciudad</label>
                <Input
                  placeholder="Ciudad"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Comuna</label>
                <Input
                  placeholder="Comuna"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Código postal</label>
                <Input
                  placeholder="Código postal"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">País</label>
                <Input
                  placeholder="País"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Teléfono</label>
              <Input
                placeholder="Teléfono"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
              />
              <label htmlFor="isDefault" className="text-slate-300 text-sm">Establecer como dirección predeterminada</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAddressOpen(false)}>Cancelar</Button>
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
            <div>
              <label className="block text-slate-300 mb-1">Tipo de dirección</label>
              <Input
                placeholder="Ej: Casa, Oficina, Apartamento..."
                value={editAddress.fullName}
                onChange={(e) => setEditAddress({ ...editAddress, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Calle</label>
              <Input
                placeholder="Calle y número"
                value={editAddress.street}
                onChange={(e) => setEditAddress({ ...editAddress, street: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Ciudad</label>
                <Input
                  placeholder="Ciudad"
                  value={editAddress.city}
                  onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Comuna</label>
                <Input
                  placeholder="Comuna"
                  value={editAddress.state}
                  onChange={(e) => setEditAddress({ ...editAddress, state: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Código postal</label>
                <Input
                  placeholder="Código postal"
                  value={editAddress.postalCode}
                  onChange={(e) => setEditAddress({ ...editAddress, postalCode: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">País</label>
                <Input
                  placeholder="País"
                  value={editAddress.country}
                  onChange={(e) => setEditAddress({ ...editAddress, country: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Teléfono</label>
              <Input
                placeholder="Teléfono"
                value={editAddress.phone}
                onChange={(e) => setEditAddress({ ...editAddress, phone: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="isDefaultEdit"
                checked={editAddress.isDefault}
                onChange={(e) => setEditAddress({ ...editAddress, isDefault: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
              />
              <label htmlFor="isDefaultEdit" className="text-slate-300 text-sm">Establecer como dirección predeterminada</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAddressOpen(false)}>Cancelar</Button>
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