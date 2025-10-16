"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";

import { registerUser } from "@/app/(store)/auth/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signUpSchema = z
  .object({
    name: z.string().min(3, "Ingresa tu nombre"),
    email: z.string().email("Correo invalido"),
    password: z.string().min(8, "Minimo 8 caracteres"),
    confirmPassword: z.string().min(8, "Repite tu contrasena"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contrasenas no coinciden",
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: SignUpFormValues) => {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        await registerUser({
          name: values.name,
          email: values.email,
          password: values.password,
        });
        setMessage("Cuenta creada con exito. Ahora puedes iniciar sesion.");
        form.reset();
      } catch (err) {
        const fallback = err instanceof Error ? err.message : "No pudimos crear tu cuenta";
        setError(fallback);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Tu nombre"
                  autoComplete="name"
                  className="rounded-xl border-slate-900 bg-slate-950/60"
                  {...field}
                />
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
                <Input
                  placeholder="tu@correo.com"
                  type="email"
                  autoComplete="email"
                  className="rounded-xl border-slate-900 bg-slate-950/60"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contrasena</FormLabel>
              <FormControl>
                <Input
                  placeholder="********"
                  type="password"
                  autoComplete="new-password"
                  className="rounded-xl border-slate-900 bg-slate-950/60"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repetir contrasena</FormLabel>
              <FormControl>
                <Input
                  placeholder="********"
                  type="password"
                  autoComplete="new-password"
                  className="rounded-xl border-slate-900 bg-slate-950/60"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {message && <p className="text-sm text-emerald-300">{message}</p>}
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <Button
          type="submit"
          className="w-full rounded-xl bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
          disabled={pending}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear cuenta"}
        </Button>
      </form>
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
        <ShieldCheck className="h-5 w-5 text-emerald-300" />
        Tus datos se protegen con cifrado AES-256 y cumplimiento GDPR.
      </div>
    </Form>
  );
}
