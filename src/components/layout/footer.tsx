import Link from "next/link";
import { Github, Instagram, Linkedin, Mail, Phone, Youtube } from "lucide-react";

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/technova", icon: Instagram },
  { name: "YouTube", href: "https://youtube.com/technova", icon: Youtube },
  { name: "LinkedIn", href: "https://linkedin.com/company/technova", icon: Linkedin },
  { name: "GitHub", href: "https://github.com/technova", icon: Github },
];

const helpLinks = [
  { label: "Centro de ayuda", href: "/soporte" },
  { label: "Seguimiento de pedidos", href: "/account/orders" },
  { label: "Garantías y devoluciones", href: "/politicas/garantias" },
  { label: "Preguntas frecuentes", href: "/faq" },
];

const companyLinks = [
  { label: "Nosotros", href: "/sobre" },
  { label: "Alianzas B2B", href: "/alianzas" },
  { label: "Prensa", href: "/prensa" },
  { label: "Sustentabilidad", href: "/sustentabilidad" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-slate-900/60 bg-[#030712]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-600/10 via-transparent to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-sky-500 to-blue-600 text-xl font-semibold text-slate-900 shadow-lg shadow-emerald-500/20 transition group-hover:scale-105 group-hover:shadow-emerald-400/30">
                TN
              </span>
              <div>
                <p className="font-heading text-lg text-slate-100">Tech Nova</p>
                <p className="text-sm text-slate-400">
                  Innovación que inspira.
                </p>
              </div>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Una tienda inmersiva para descubrir, comparar y adquirir la tecnología que potencia tu día a día.
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Phone className="h-4 w-4 text-emerald-400" />
              <span>+56 2 2945 8890</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Mail className="h-4 w-4 text-emerald-400" />
              <span>hola@technova.dev</span>
            </div>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  aria-label={link.name}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-800/80 bg-slate-900/60 p-2 text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-400"
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Ayuda
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Compañía
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-slate-900/40 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Únete a la experiencia
            </p>
            <p className="text-sm text-slate-300">
              Recibe lanzamientos exclusivos, invitaciones a workshops y beneficios únicos para miembros Nova+.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="tu correo"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-emerald-400 via-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                Suscribirme
              </button>
            </form>
            <p className="text-xs text-slate-500">
              Aceptas nuestra política de privacidad y el envío de comunicaciones digitales.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-900/80 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Tech Nova. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/terminos" className="hover:text-emerald-400">
              Términos y condiciones
            </Link>
            <Link href="/privacidad" className="hover:text-emerald-400">
              Política de privacidad
            </Link>
            <Link href="/cookies" className="hover:text-emerald-400">
              Preferencias de cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
