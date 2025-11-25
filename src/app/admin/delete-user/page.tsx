"use client";

import { useState } from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DeleteUserPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar usuario");
      }

      const data = await response.json();
      setMessage(data.message);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/register");
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al eliminar usuario");
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
          <p className="text-sm text-slate-500">Eliminar usuario existente</p>
        </div>

        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-center text-lg text-slate-100">
              Eliminar cuenta de usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-300">
                  {message}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email del usuario a eliminar
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className="bg-slate-900/50 border-slate-800"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-red-600 py-2 font-semibold text-white hover:bg-red-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Eliminando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Eliminar usuario
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-500">
              <Link href="/register" className="text-emerald-300 hover:text-emerald-200">
                Ir a registro de nuevo usuario
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
