"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

const checkoutFormSchema = z.object({
  name: z.string().min(3, "Ingresa tu nombre"),
  email: z.string().email("Correo invalido"),
  phone: z.string().min(8, "Telefono invalido"),
  street: z.string().min(5, "Ingresa tu direccion"),
  city: z.string().min(2),
  region: z.string().min(2),
  postalCode: z.string().min(4),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const items = useCartStore((state) => state.items);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      region: "",
      postalCode: "",
      notes: "",
    },
  });

  const onSubmit = (values: CheckoutFormValues) => {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contact: {
              name: values.name,
              email: values.email,
              phone: values.phone,
            },
            shipping: {
              street: values.street,
              city: values.city,
              region: values.region,
              postalCode: values.postalCode,
              notes: values.notes,
            },
          }),
        });

        if (!response.ok) {
          const payload = await response.json();
          setError(payload.error ?? "No se pudo procesar el pedido");
          return;
        }

        const payload = await response.json();
        if (payload.checkoutUrl) {
          window.location.href = payload.checkoutUrl as string;
          return;
        }

        setMessage("Pedido confirmado. Gracias por comprar en Tech Nova.");
        router.push(`/checkout/success?order=${payload.orderId ?? ""}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo procesar el pedido");
      }
    });
  };

  const disabled = items.length === 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre y apellido" className="rounded-xl border-slate-900 bg-slate-950/60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electronico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="tu@correo.com" className="rounded-xl border-slate-900 bg-slate-950/60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefono</FormLabel>
                <FormControl>
                  <Input placeholder="+56 9 9999 9999" className="rounded-xl border-slate-900 bg-slate-950/60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codigo postal</FormLabel>
                <FormControl>
                  <Input placeholder="000000" className="rounded-xl border-slate-900 bg-slate-950/60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direccion</FormLabel>
              <FormControl>
                <Input placeholder="Calle, numero, departamento" className="rounded-xl border-slate-900 bg-slate-950/60" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad / Comuna</FormLabel>
                <FormControl>
                  <Input placeholder="Ciudad" className="rounded-xl border-slate-900 bg-slate-950/60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input placeholder="RM" className="rounded-xl border-slate-900 bg-slate-950/60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas para el envio (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Indicaciones para la entrega"
                  className="min-h-[100px] rounded-xl border-slate-900 bg-slate-950/60"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {message && <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}
        {error && <p className="rounded-xl bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}

        <Button
          type="submit"
          className="w-full rounded-xl bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
          disabled={pending || disabled}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar pedido"}
        </Button>
      </form>
    </Form>
  );
}
