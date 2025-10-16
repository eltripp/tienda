"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  ArrowRight,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  User2,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { cn, formatCurrency } from "@/lib/utils";

const primaryLinks = [
  { label: "Catálogo", href: "/products" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Experiencias", href: "/experiencias" },
  { label: "Blog", href: "/blog" },
];

const categoryLinks = [
  {
    label: "Laptops & Desktops",
    description:
      "Workstations, ultrabooks y setups de alto rendimiento listos para producción o gaming.",
    href: "/products?category=laptops",
  },
  {
    label: "Smartphones",
    description:
      "Flagships, plegables y accesorios diseñados para elevar tu productividad móvil.",
    href: "/products?category=smartphones",
  },
  {
    label: "Audio inmersivo",
    description:
      "Audífonos ANC, soundbars y parlantes hi-fi con audio espacial y certificación THX.",
    href: "/products?category=audio",
  },
  {
    label: "Accesorios Pro",
    description:
      "Monitores 5K, hubs Thunderbolt, teclados mecánicos y dispositivos IoT premium.",
    href: "/products?category=accesorios",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const cartItems = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.setDrawerOpen);
  // select primitives instead of returning a new object directly from the selector.
  // Returning a fresh object can trigger React's useSyncExternalStore/getServerSnapshot warnings
  // in development because the snapshot appears to change on every call. Selecting
  // primitives and memoizing the combined object avoids that.
  const total = useCartStore((state) => state.total);
  const currency = useCartStore((state) => state.currency);
  // Avoid creating a combined object—use primitives directly to prevent
  // any chance of unstable snapshots from object allocation.

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center bg-transparent px-4 transition md:px-10">
      <div className="relative flex w-full items-center justify-between rounded-2xl border border-transparent bg-transparent px-4 py-3 transition-all">
        <AnimatePresence>
          {scrolled && (
            <motion.div
              key="navbar-bg"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="absolute inset-0 -z-10 rounded-2xl border border-slate-900/80 bg-slate-950/95 shadow-2xl shadow-black/70 backdrop-blur-xl"
            />
          )}
        </AnimatePresence>
        <nav className="flex w-full items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-900 bg-slate-950 text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-400 lg:hidden"
                  aria-label="Abrir menú"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs bg-slate-950 text-slate-100">
                <div className="mt-10 space-y-6">
                  {primaryLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block text-lg transition",
                        pathname.startsWith(link.href)
                          ? "text-emerald-400"
                          : "text-slate-300 hover:text-emerald-300",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Categorías
                    </p>
                    {categoryLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex flex-col rounded-xl border border-slate-900/70 bg-slate-900/60 p-3 transition hover:border-emerald-400/40 hover:bg-slate-900"
                      >
                        <span className="text-sm text-slate-100">{link.label}</span>
                        <span className="text-xs text-slate-500">
                          {link.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="group flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 via-sky-500 to-blue-600 text-lg font-bold text-slate-900 shadow-lg shadow-emerald-500/20 transition group-hover:scale-105 group-hover:shadow-emerald-400/30">
                TN
              </div>
              <div>
                <p className="font-heading text-lg text-slate-100">
                  Tech Nova
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">
                  Future Forward
                </p>
              </div>
            </Link>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="rounded-xl bg-transparent px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-emerald-400">
                    Categorías
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="rounded-3xl border border-slate-900/80 bg-slate-950/90 shadow-2xl shadow-black/50 backdrop-blur-lg">
                    <div className="grid min-w-[500px] gap-4 p-6 md:grid-cols-2">
                      {categoryLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex flex-col gap-2 rounded-2xl border border-transparent bg-slate-900/40 p-4 transition hover:border-emerald-500/40 hover:bg-slate-900"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-400" />
                            <p className="font-medium text-slate-100">
                              {link.label}
                            </p>
                          </div>
                          <p className="text-sm text-slate-400">
                            {link.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                {primaryLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "rounded-xl bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:text-emerald-400",
                        pathname.startsWith(link.href) &&
                          "bg-slate-900/70 text-emerald-400",
                      )}
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="relative flex w-full max-w-xl items-center">
              <Search className="absolute left-4 h-4 w-4 text-slate-500" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busca laptops, smartphones, accesorios..."
                className="h-11 w-full rounded-2xl border border-slate-900 bg-slate-950/70 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30"
              />
              <Button
                size="sm"
                className="absolute right-2 h-7 rounded-xl bg-emerald-500 px-3 text-xs font-semibold text-emerald-950 hover:bg-emerald-400"
              >
                Buscar
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-900 bg-slate-950 text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-400 lg:hidden"
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <Search className="h-4 w-4" />
            </button>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hidden items-center gap-2 rounded-xl border border-transparent bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400/40 hover:text-emerald-300 lg:flex">
                    <User2 className="h-4 w-4" />
                    Cuenta
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="rounded-2xl border border-slate-900/80 bg-slate-950/90 p-2 shadow-2xl shadow-black/50 backdrop-blur-lg">
                    <div className="min-w-[200px]">
                      {session ? (
                        <>
                          {session.user?.name && (
                            <div className="px-4 py-2">
                              <p className="text-sm font-medium text-slate-100">{session.user.name}</p>
                              <p className="text-xs text-slate-500">{session.user.email}</p>
                            </div>
                          )}
                          <div className="my-1 border-t border-slate-900" />
                          <Link 
                            href="/account" 
                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-emerald-400"
                          >
                            <User2 className="h-4 w-4" />
                            Mi perfil
                          </Link>
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-red-400 transition hover:bg-slate-900"
                          >
                            <LogOut className="h-4 w-4" />
                            Cerrar sesión
                          </button>
                        </>
                      ) : (
                        <Link 
                          href="/auth/sign-in" 
                          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-emerald-400"
                        >
                          <User2 className="h-4 w-4" />
                          Iniciar sesión
                        </Link>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <button
              type="button"
              onClick={() => openCart(true)}
              className="relative flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-2 text-sm font-medium text-slate-100 shadow-lg shadow-emerald-500/10 transition hover:border-emerald-400/40 hover:text-emerald-300"
            >
              <ShoppingBag className="h-5 w-5 text-emerald-400" />
              <div className="flex flex-col items-start">
                <span className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">
                  Carrito
                </span>
                <span className="text-sm text-slate-100">
                  {formatCurrency(total, currency)}
                </span>
              </div>
              {totalItems > 0 && (
                <Badge className="absolute -right-3 -top-2 rounded-full bg-emerald-500 text-xs font-semibold text-emerald-950">
                  {totalItems}
                </Badge>
              )}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full w-full border-b border-slate-900/60 bg-slate-950/95 p-4 backdrop-blur-lg lg:hidden"
          >
            <div className="flex flex-col gap-4">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-slate-500" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Busca productos increíbles..."
                  className="h-12 w-full rounded-2xl border border-slate-900 bg-slate-900/70 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <Button className="h-11 rounded-xl bg-emerald-500 text-sm font-semibold text-emerald-950 hover:bg-emerald-400">
                Buscar ahora
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-6 top-4 -z-10 h-16 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-transparent to-sky-500/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-20 h-72 bg-[radial-gradient(circle_farthest-side,rgba(16,185,129,0.12),transparent)]" />

      <div className="pointer-events-none absolute inset-x-0 top-full -z-10 h-24 bg-gradient-to-b from-slate-950/60 via-slate-950/0 to-transparent" />

      <div className="pointer-events-none absolute right-6 top-24 -z-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

      {totalItems > 0 && (
        <div className="fixed bottom-4 left-1/2 z-40 flex w-[90%] max-w-md -translate-x-1/2 items-center justify-between rounded-2xl border border-emerald-500/30 bg-slate-950/90 px-4 py-3 shadow-2xl shadow-emerald-500/20 backdrop-blur-lg md:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
              Carrito
            </p>
            <p className="text-sm font-semibold text-slate-100">
              {totalItems} producto{totalItems > 1 ? "s" : ""} listos para checkout
            </p>
          </div>
          <Button
            size="sm"
            className="rounded-xl bg-emerald-500 px-3 text-xs font-semibold text-emerald-950 hover:bg-emerald-400"
            onClick={() => openCart(true)}
          >
            Revisar <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}
    </header>
  );
}
