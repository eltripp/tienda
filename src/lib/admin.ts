import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("No autorizado: Se requieren permisos de administrador");
  }

  return session;
}

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}
