import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-slate-950/60 p-6 sm:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
