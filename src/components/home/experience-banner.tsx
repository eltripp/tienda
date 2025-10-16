import { Clock, Headphones, ShieldCheck, Truck } from "lucide-react";

const experiences = [
  {
    title: "Entrega inteligente",
    description:
      "Calculamos tiempos reales según tu comuna y partners logísticos premium con seguimiento en vivo.",
    icon: Truck,
  },
  {
    title: "Soporte proactivo 24/7",
    description:
      "Ingenieros certificados disponibles por chat, videollamada o visitas in situ para clientes enterprise.",
    icon: Headphones,
  },
  {
    title: "Protección Nova Care",
    description:
      "Cobertura extendida, reemplazo anticipado y gestión sin fricciones para dispositivos críticos.",
    icon: ShieldCheck,
  },
  {
    title: "Upgrades sin pausa",
    description:
      "Planes de renovación anual con recompra inteligente y migración de datos orquestada.",
    icon: Clock,
  },
];

export function ExperienceBanner() {
  return (
    <section className="mt-24">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-emerald-500/10 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900 px-6 py-12 sm:px-10 lg:px-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
              Servicio Tech Nova
            </p>
            <h2 className="font-heading text-3xl text-slate-50">
              Compras memorables con acompañamiento experto
            </h2>
            <p className="text-sm text-slate-400">
              Elige un plan Nova+ y accede a upgrades preferenciales, soporte dedicado y beneficios exclusivos como salas de demo privadas y workshops con especialistas.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {experiences.map((experience) => (
              <div
                key={experience.title}
                className="group space-y-3 rounded-2xl border border-slate-900/80 bg-slate-900/50 p-5 transition hover:border-emerald-500/40 hover:bg-slate-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition group-hover:border-emerald-500/60 group-hover:bg-emerald-500/20">
                  <experience.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-100">
                  {experience.title}
                </h3>
                <p className="text-sm text-slate-400">
                  {experience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
