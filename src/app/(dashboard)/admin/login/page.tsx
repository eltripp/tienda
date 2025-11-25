"use client";

import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Usar NextAuth para iniciar sesión directamente
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error("Credenciales inválidas");
      }

      // Redirigir al dashboard
      router.push("/admin");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 via-sky-500 to-blue-600 text-lg font-bold text-slate-900 shadow-lg shadow-emerald-500/20 mx-auto">
            TN
          </span>
          <h1 className="mt-4 font-heading text-2xl text-slate-100">Tech Nova</h1>
          <p className="text-sm text-slate-500">Panel de administración</p>
        </div>

        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-center text-lg text-slate-100">
              Iniciar sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@technova.dev"
                  className="bg-slate-900/50 border-slate-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••"
                    className="bg-slate-900/50 border-slate-800 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 py-2 font-semibold text-emerald-950 hover:bg-emerald-400"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-950 border-t-transparent"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Iniciar sesión
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-500">
              ¿Olvidaste tu contraseña?{" "}
              <Link href="/admin/forgot-password" className="text-emerald-300 hover:text-emerald-200">
                Recuperar
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500">
          © 2023 Tech Nova. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
