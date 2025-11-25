"use client";

import { useState } from "react";
import { Save, Mail, Globe, CreditCard, Truck, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Datos de ejemplo - en una app real estos vendrían de la API
const storeSettings = {
  name: "Tech Nova",
  email: "contacto@technova.dev",
  phone: "+56 2 2345 6789",
  address: "Av. Providencia 1234, Santiago, Chile",
  description: "Tienda de tecnología con los mejores productos del mercado",
  currency: "CLP",
  language: "es",
  timezone: "America/Santiago",
  lowStockThreshold: 10,
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  enablePushNotifications: true,
  enableOrderConfirmation: true,
  enableShippingConfirmation: true,
  enableDeliveryConfirmation: true,
  enableRefundNotifications: true,
  paymentMethods: ["credit_card", "transfer", "webpay"],
  shippingMethods: ["standard", "express"],
  freeShippingThreshold: 50000,
  standardShippingCost: 5000,
  expressShippingCost: 10000,
  taxRate: 19,
  enableTaxCalculation: true,
  maintenanceMode: false,
  enableRegistration: true,
  enableGuestCheckout: true,
  enableReviews: true,
  enableWishlist: true,
  primaryColor: "#10b981",
  secondaryColor: "#3b82f6",
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.ico",
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(storeSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSubmitting(true);

    try {
      // En una app real, aquí se enviarían los datos a la API
      console.log("Guardar configuración:", settings);

      // Simulación de espera
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mostrar mensaje de éxito
      alert("Configuración guardada correctamente");
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      alert("Error al guardar la configuración");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Configuración</p>
        <h1 className="font-heading text-3xl text-slate-100">Ajustes</h1>
        <p className="text-sm text-slate-400">Administra la configuración general de tu tienda.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-slate-900/50">
          <TabsTrigger value="general" className="data-[state=active]:bg-slate-800">General</TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-slate-800">Pagos</TabsTrigger>
          <TabsTrigger value="shipping" className="data-[state=active]:bg-slate-800">Envíos</TabsTrigger>
          <TabsTrigger value="taxes" className="data-[state=active]:bg-slate-800">Impuestos</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-800">Notificaciones</TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-slate-800">Apariencia</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Información de la tienda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-slate-300">
                    Nombre de la tienda
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={settings.name}
                    onChange={handleInputChange}
                    placeholder="Nombre de la tienda"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300">
                    Email de contacto
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    placeholder="Email de contacto"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone" className="text-slate-300">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    placeholder="Teléfono de contacto"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-slate-300">
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    placeholder="Dirección de la tienda"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-300">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={settings.description}
                  onChange={handleInputChange}
                  placeholder="Descripción de la tienda"
                  rows={4}
                  className="bg-slate-900/50 border-slate-800 resize-none"
                />
              </div>

              <Separator className="bg-slate-800" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="currency" className="text-slate-300">
                    Moneda
                  </Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => handleSelectChange("currency", value)}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-800">
                      <SelectValue placeholder="Seleccionar moneda" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-900">
                      <SelectItem value="CLP">Peso Chileno (CLP)</SelectItem>
                      <SelectItem value="CLP">Peso Chileno (CLP)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language" className="text-slate-300">
                    Idioma
                  </Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSelectChange("language", value)}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-800">
                      <SelectValue placeholder="Seleccionar idioma" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-900">
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="timezone" className="text-slate-300">
                  Zona horaria
                </Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => handleSelectChange("timezone", value)}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-800">
                    <SelectValue placeholder="Seleccionar zona horaria" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-900">
                    <SelectItem value="America/Santiago">Santiago (GMT-3)</SelectItem>
                    <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                    <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-slate-800" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-100">Modo mantenimiento</p>
                    <p className="text-sm text-slate-500">
                      Activa el modo mantenimiento para mostrar una página de mantenimiento a los clientes
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSwitchChange("maintenanceMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-100">Permitir registro</p>
                    <p className="text-sm text-slate-500">
                      Permite que los nuevos usuarios creen una cuenta en tu tienda
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableRegistration}
                    onCheckedChange={(checked) => handleSwitchChange("enableRegistration", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-100">Checkout para invitados</p>
                    <p className="text-sm text-slate-500">
                      Permite que los clientes realicen compras sin crear una cuenta
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableGuestCheckout}
                    onCheckedChange={(checked) => handleSwitchChange("enableGuestCheckout", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-100">Reseñas de productos</p>
                    <p className="text-sm text-slate-500">
                      Permite que los clientes dejen reseñas en los productos
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableReviews}
                    onCheckedChange={(checked) => handleSwitchChange("enableReviews", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-100">Lista de deseos</p>
                    <p className="text-sm text-slate-500">
                      Permite que los clientes guarden productos en una lista de deseos
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableWishlist}
                    onCheckedChange={(checked) => handleSwitchChange("enableWishlist", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Métodos de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Métodos habilitados</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-100">Tarjetas de crédito/débito</p>
                        <p className="text-sm text-slate-500">Visa, Mastercard, American Express</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.paymentMethods.includes("credit_card")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSettings((prev) => ({
                            ...prev,
                            paymentMethods: [...prev.paymentMethods, "credit_card"],
                          }));
                        } else {
                          setSettings((prev) => ({
                            ...prev,
                            paymentMethods: prev.paymentMethods.filter(
                              (method) => method !== "credit_card"
                            ),
                          }));
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-100">Transferencia bancaria</p>
                        <p className="text-sm text-slate-500">Transferencia directa a cuenta bancaria</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.paymentMethods.includes("transfer")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSettings((prev) => ({
                            ...prev,
                            paymentMethods: [...prev.paymentMethods, "transfer"],
                          }));
                        } else {
                          setSettings((prev) => ({
                            ...prev,
                            paymentMethods: prev.paymentMethods.filter(
                              (method) => method !== "transfer"
                            ),
                          }));
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-100">WebPay</p>
                        <p className="text-sm text-slate-500">Pasarela de pago chilena</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.paymentMethods.includes("webpay")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSettings((prev) => ({
                            ...prev,
                            paymentMethods: [...prev.paymentMethods, "webpay"],
                          }));
                        } else {
                          setSettings((prev) => ({
                            ...prev,
                            paymentMethods: prev.paymentMethods.filter(
                              (method) => method !== "webpay"
                            ),
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Configuración de envíos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Métodos de envío</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-100">Envío estándar</p>
                        <p className="text-sm text-slate-500">3-5 días hábiles</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.shippingMethods.includes("standard")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSettings((prev) => ({
                            ...prev,
                            shippingMethods: [...prev.shippingMethods, "standard"],
                          }));
                        } else {
                          setSettings((prev) => ({
                            ...prev,
                            shippingMethods: prev.shippingMethods.filter(
                              (method) => method !== "standard"
                            ),
                          }));
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-100">Envío express</p>
                        <p className="text-sm text-slate-500">1-2 días hábiles</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.shippingMethods.includes("express")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSettings((prev) => ({
                            ...prev,
                            shippingMethods: [...prev.shippingMethods, "express"],
                          }));
                        } else {
                          setSettings((prev) => ({
                            ...prev,
                            shippingMethods: prev.shippingMethods.filter(
                              (method) => method !== "express"
                            ),
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="freeShippingThreshold" className="text-slate-300">
                    Envío gratis a partir de
                  </Label>
                  <Input
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
                <div>
                  <Label htmlFor="lowStockThreshold" className="text-slate-300">
                    Umbral de stock bajo
                  </Label>
                  <Input
                    id="lowStockThreshold"
                    name="lowStockThreshold"
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="standardShippingCost" className="text-slate-300">
                    Costo de envío estándar
                  </Label>
                  <Input
                    id="standardShippingCost"
                    name="standardShippingCost"
                    type="number"
                    value={settings.standardShippingCost}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
                <div>
                  <Label htmlFor="expressShippingCost" className="text-slate-300">
                    Costo de envío express
                  </Label>
                  <Input
                    id="expressShippingCost"
                    name="expressShippingCost"
                    type="number"
                    value={settings.expressShippingCost}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-6">
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Configuración de impuestos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-100">Calcular impuestos automáticamente</p>
                  <p className="text-sm text-slate-500">
                    Calcula automáticamente el impuesto en el checkout
                  </p>
                </div>
                <Switch
                  checked={settings.enableTaxCalculation}
                  onCheckedChange={(checked) => handleSwitchChange("enableTaxCalculation", checked)}
                />
              </div>

              {settings.enableTaxCalculation && (
                <div>
                  <Label htmlFor="taxRate" className="text-slate-300">
                    Tasa de impuesto (%)
                  </Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Canales de notificación</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-100">Email</p>
                        <p className="text-sm text-slate-500">Notificaciones por correo electrónico</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enableEmailNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("enableEmailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-100">SMS</p>
                        <p className="text-sm text-slate-500">Notificaciones por mensaje de texto</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enableSmsNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("enableSmsNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-100">Push</p>
                        <p className="text-sm text-slate-500">Notificaciones push en el navegador</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enablePushNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("enablePushNotifications", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              <div>
                <Label className="text-slate-300">Eventos de notificación</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-100">Confirmación de pedido</p>
                      <p className="text-sm text-slate-500">Notificar al cliente cuando se realiza un pedido</p>
                    </div>
                    <Switch
                      checked={settings.enableOrderConfirmation}
                      onCheckedChange={(checked) => handleSwitchChange("enableOrderConfirmation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-100">Confirmación de envío</p>
                      <p className="text-sm text-slate-500">Notificar al cliente cuando se despacha un pedido</p>
                    </div>
                    <Switch
                      checked={settings.enableShippingConfirmation}
                      onCheckedChange={(checked) => handleSwitchChange("enableShippingConfirmation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-100">Confirmación de entrega</p>
                      <p className="text-sm text-slate-500">Notificar al cliente cuando se entrega un pedido</p>
                    </div>
                    <Switch
                      checked={settings.enableDeliveryConfirmation}
                      onCheckedChange={(checked) => handleSwitchChange("enableDeliveryConfirmation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-100">Notificaciones de reembolso</p>
                      <p className="text-sm text-slate-500">Notificar al cliente cuando se procesa un reembolso</p>
                    </div>
                    <Switch
                      checked={settings.enableRefundNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("enableRefundNotifications", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-slate-900/70 bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100">Personalización visual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="primaryColor" className="text-slate-300">
                    Color primario
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      value={settings.primaryColor}
                      onChange={handleInputChange}
                      placeholder="#10b981"
                      className="bg-slate-900/50 border-slate-800"
                    />
                    <div 
                      className="h-8 w-8 rounded-md border border-slate-700"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor" className="text-slate-300">
                    Color secundario
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      name="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={handleInputChange}
                      placeholder="#3b82f6"
                      className="bg-slate-900/50 border-slate-800"
                    />
                    <div 
                      className="h-8 w-8 rounded-md border border-slate-700"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="logoUrl" className="text-slate-300">
                    URL del logo
                  </Label>
                  <Input
                    id="logoUrl"
                    name="logoUrl"
                    value={settings.logoUrl}
                    onChange={handleInputChange}
                    placeholder="/logo.png"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
                <div>
                  <Label htmlFor="faviconUrl" className="text-slate-300">
                    URL del favicon
                  </Label>
                  <Input
                    id="faviconUrl"
                    name="faviconUrl"
                    value={settings.faviconUrl}
                    onChange={handleInputChange}
                    placeholder="/favicon.ico"
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={isSubmitting}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
