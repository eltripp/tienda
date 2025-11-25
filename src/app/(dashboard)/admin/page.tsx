import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirigir al dashboard principal
  redirect("/admin/dashboard");
}
