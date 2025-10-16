import type { Metadata, Viewport } from "next";
import { Space_Grotesk as Grotesk, Manrope } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const grotesk = Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Tech Nova | La tienda esencial para entusiastas tecnológicos",
    template: "%s | Tech Nova",
  },
  description:
    "Descubre laptops, smartphones, audio y accesorios premium en Tech Nova. Compra con envíos inteligentes, promociones exclusivas y experiencias personalizadas.",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
  metadataBase: new URL("https://tech-nova-store.example"),
  openGraph: {
    title: "Tech Nova | Innovación que inspira",
    description:
      "Explora la nueva generación de productos tecnológicos con entregas rápidas, soporte experto y beneficios exclusivos para clientes frecuentes.",
    url: "https://tech-nova-store.example",
    siteName: "Tech Nova Store",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tech Nova storefront preview",
      },
    ],
    type: "website",
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Nova | Innovación que inspira",
    description:
      "Explora la nueva generación de productos tecnológicos con entregas rápidas y beneficios exclusivos.",
    creator: "@technova",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-slate-950 text-slate-100 antialiased",
          grotesk.variable,
          manrope.variable,
          "bg-grid-sm [--grid-color:rgba(148,163,184,0.08)]"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
