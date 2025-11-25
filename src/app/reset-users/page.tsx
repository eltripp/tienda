"use client";

import { useState } from "react";
import { AlertTriangle, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ResetUsersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar todos los usuarios y crear un nuevo administrador? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/reset-all-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al reiniciar la base de datos");
      }

      const data = await response.json();
      setMessage(`Base de datos reiniciada correctamente. Se ha creado el usuario administrador: ${data.admin.email}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al reiniciar la base de datos");
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
          <p className="text-sm text-slate-500">Reiniciar usuarios</p>
        </div>

        <Card className="border-red-900/70 bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center text-lg text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Zona de peligro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-300">
              <p className="font-semibold">⚠️ Advertencia:</p>
              <p>
                Esta acción eliminará permanentemente todos los usuarios existentes en la base de datos y creará un nuevo usuario administrador con las siguientes credenciales:
              </p>
              <div className="mt-2 rounded bg-black/20 p-2 font-mono text-xs">
                <p>Email: cristivn.rc@gmail.com</p>
                <p>Contraseña: admin@7139</p>
              </div>
            </div>

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

            <Button
              onClick={handleReset}
              className="w-full rounded-xl bg-red-600 py-2 font-semibold text-red-50 hover:bg-red-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-50 border-t-transparent"></div>
                  Procesando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Eliminar todos los usuarios y crear administrador
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm text-slate-500">
          <Link href="/" className="text-emerald-300 hover:text-emerald-200">
            Volver al inicio
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500">
          © 2023 Tech Nova. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
