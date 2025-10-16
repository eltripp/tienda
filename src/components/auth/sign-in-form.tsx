"use client";

import { useTransition } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Mail } from "lucide-react";

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

const signInSchema = z.object({
  email: z.string().email("Ingresa un correo valido"),
  password: z.string().min(8, "Minimo 8 caracteres"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

type SignInFormProps = {
  defaultEmail?: string;
};

export function SignInForm({ defaultEmail }: SignInFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: defaultEmail ?? "",
      password: "",
    },
  });

  const handleSubmit = (values: SignInFormValues) => {
    startTransition(async () => {
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/account",
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electronico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tu@correo.com"
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
                  type="password"
                  placeholder="********"
                  autoComplete="current-password"
                  className="rounded-xl border-slate-900 bg-slate-950/60"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded-xl bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
          disabled={pending}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Iniciar sesion"}
        </Button>
      </form>
      <Button
        type="button"
        variant="outline"
        className="mt-4 w-full rounded-xl border-slate-800 text-slate-200 hover:border-emerald-400/40 hover:text-emerald-200"
        onClick={() => signIn("google", { callbackUrl: "/account" })}
      >
        <Mail className="mr-2 h-4 w-4" /> Continuar con Google
      </Button>
    </Form>
  );
}
