import Link from "next/link";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { Separator } from "@/components/ui/separator";

export default function SignUpPage() {
  return (
    <div className="space-y-6 rounded-3xl border border-slate-900/70 bg-slate-950/60 p-8 shadow-[0_30px_120px_-80px_rgba(56,189,248,0.6)]">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Crea tu cuenta
        </p>
        <h1 className="font-heading text-3xl text-slate-100">Únete a Tech Nova</h1>
        <p className="text-sm text-slate-400">
          Centraliza direcciones, métodos de pago y obtén recomendaciones según tu stack.
        </p>
      </div>
      <SignUpForm />
      <Separator className="border-slate-900/70" />
      <p className="text-sm text-slate-400">
        ¿Ya eres miembro?{" "}
        <Link href="/auth/sign-in" className="font-semibold text-emerald-300 transition hover:text-emerald-200">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}
