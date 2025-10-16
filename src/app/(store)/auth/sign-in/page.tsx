import Link from "next/link";

import { SignInForm } from "@/components/auth/sign-in-form";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
  return (
    <div className="space-y-6 rounded-3xl border border-slate-900/70 bg-slate-950/60 p-8 shadow-[0_30px_120px_-80px_rgba(16,185,129,0.6)]">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Bienvenido de vuelta
        </p>
        <h1 className="font-heading text-3xl text-slate-100">Inicia sesión</h1>
        <p className="text-sm text-slate-400">
          Accede a tu historial, direcciones guardadas y beneficios Nova+ personalizados.
        </p>
      </div>
      <SignInForm />
      <Separator className="border-slate-900/70" />
      <p className="text-sm text-slate-400">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/auth/sign-up" className="font-semibold text-emerald-300 transition hover:text-emerald-200">
          Crea una aquí
        </Link>
      </p>
    </div>
  );
}
