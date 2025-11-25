import { useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SetAdminPage() {
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
      const response = await fetch("/api/admin/set-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al actualizar usuario");
      }

      const data = await response.json();
      setMessage(data.message);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al actualizar usuario");
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
          <p className="text-sm text-slate-500">Convertir usuario en administrador</p>
        </div>

        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader>
            <CardTitle className="text-center text-lg text-slate-100">
              Asignar rol de administrador
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
                  Email del usuario
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
                className="w-full rounded-xl bg-emerald-500 py-2 font-semibold text-emerald-950 hover:bg-emerald-400"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-950 border-t-transparent"></div>
                    Procesando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Convertir en administrador
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-500">
              <Link href="/admin/login" className="text-emerald-300 hover:text-emerald-200">
                Ir a inicio de sesión
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
