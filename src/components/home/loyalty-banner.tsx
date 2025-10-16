import { Gift, Percent, Sparkles } from "lucide-react";

const perks = [
  {
    title: "Cashback recurrente",
    detail: "Hasta 10% en Nova Credits para futuras compras.",
    icon: Percent,
  },
  {
    title: "Accesos anticipados",
    detail: "Reservas de lanzamientos globales antes del mercado local.",
    icon: Sparkles,
  },
  {
    title: "Regalos exclusivos",
    detail: "Kits de experiencia, merchandising premium y upgrades sorpresa.",
    icon: Gift,
  },
];

export function LoyaltyBanner() {
  return (
    <section className="mt-24">
      <div className="mx-auto w-full max-w-7xl rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-slate-950 px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">
              Programa Nova+
            </p>
            <h2 className="font-heading text-3xl text-slate-50 sm:text-4xl">
              Clientes frecuentes, beneficios exponenciales
            </h2>
            <p className="max-w-xl text-base text-emerald-100/80">
              Registrados acceden a direcciones guardadas, pedidos express, historial inteligente y recomendaciones basadas en tu stack actual.
            </p>
            <div className="flex flex-wrap gap-4">
              {perks.map((perk) => (
                <div
                  key={perk.title}
                  className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-100"
                >
                  <perk.icon className="mt-0.5 h-5 w-5 text-emerald-300" />
                  <div>
                    <p className="text-sm font-semibold">{perk.title}</p>
                    <p className="text-xs text-emerald-100/80">{perk.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-emerald-500/30 bg-slate-950/80 p-6 text-slate-100 shadow-[0_30px_80px_-60px_rgba(45,212,191,0.5)]">
            <h3 className="text-lg font-semibold">¿Listo para subir de nivel?</h3>
            <p className="text-sm text-emerald-100/70">
              Crea tu cuenta o inicia sesión para habilitar descuentos automáticos, métodos de pago guardados y seguimiento avanzado de tus despachos.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="/auth/sign-up"
                className="flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
              >
                Crear cuenta gratuita
              </a>
              <a
                href="/auth/sign-in"
                className="flex items-center justify-center rounded-xl border border-emerald-500/30 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:border-emerald-400/50 hover:bg-emerald-500/10"
              >
                Ya soy miembro
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
