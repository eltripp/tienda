import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Eye, Mail, Phone, MapPin, Calendar, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, formatNumber } from "@/lib/utils";
import Link from "next/link";

// Obtener datos de clientes de la API
const [customers, setCustomers] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers");
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCustomers();
}, []);

// Función para convertir usuario en administrador
const handleSetAdmin = async (email: string) => {
  try {
    const response = await fetch("/api/admin/set-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      // Actualizar la lista de clientes
      fetchCustomers();
      alert("Usuario convertido en administrador exitosamente");
    } else {
      const data = await response.json();
      alert(data.error || "Error al convertir en administrador");
    }
  } catch (error) {
    console.error("Error al convertir en administrador:", error);
    alert("Error al convertir en administrador");
  }
};

// Función para eliminar usuario
const handleDeleteUser = async (email: string) => {
  if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${email}?`)) {
    return;
  }

  try {
    const response = await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      // Actualizar la lista de clientes
      fetchCustomers();
      alert("Usuario eliminado exitosamente");
    } else {
      const data = await response.json();
      alert(data.error || "Error al eliminar usuario");
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    alert("Error al eliminar usuario");
  }
};

// Datos de ejemplo - en una app real estos vendrían de la API
const exampleCustomers = [
  {
    id: "1",
    name: "Constanza Rojas",
    email: "constanza@example.com",
    phone: "+56 9 1234 5678",
    avatar: "https://avatar.vercel.sh/constanza@example.com",
    joinDate: "2023-01-15",
    lastOrder: "2023-10-28",
    totalOrders: 12,
    totalSpent: 4689000,
    status: "active",
  },
  {
    id: "2",
    name: "Ignacio Díaz",
    email: "ignacio@example.com",
    phone: "+56 9 8765 4321",
    avatar: "https://avatar.vercel.sh/ignacio@example.com",
    joinDate: "2023-02-20",
    lastOrder: "2023-10-25",
    totalOrders: 8,
    totalSpent: 2845000,
    status: "active",
  },
  {
    id: "3",
    name: "Kibernum",
    email: "compras@kibernum.com",
    phone: "+56 2 2345 6789",
    avatar: "https://avatar.vercel.sh/compras@kibernum.com",
    joinDate: "2022-11-10",
    lastOrder: "2023-10-27",
    totalOrders: 32,
    totalSpent: 18999000,
    status: "active",
  },
  {
    id: "4",
    name: "María González",
    email: "maria@example.com",
    phone: "+56 9 5555 6666",
    avatar: "https://avatar.vercel.sh/maria@example.com",
    joinDate: "2023-03-05",
    lastOrder: "2023-09-15",
    totalOrders: 4,
    totalSpent: 1299000,
    status: "inactive",
  },
];

const statusConfig = {
  active: {
    label: "Activo",
    color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  },
  inactive: {
    label: "Inactivo",
    color: "bg-slate-500/10 text-slate-300 border-slate-500/30",
  },
};

export default function AdminCustomersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Clientes</p>
          <h1 className="font-heading text-3xl text-slate-100">Relaciones</h1>
          <p className="text-sm text-slate-400">Identifica clientes frecuentes y oportunidades de fidelización.</p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="border-slate-900/70 bg-slate-950/60">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-800"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800">
                <Filter className="mr-2 h-4 w-4" /> Más filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjetas de clientes */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {customers.map((customer) => (
          <Card key={customer.id} className="border-slate-900/70 bg-slate-950/60">
            <CardHeader className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={customer.avatar} />
                <AvatarFallback>{customer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="truncate text-lg text-slate-100">{customer.name}</CardTitle>
                <p className="truncate text-xs text-slate-500">{customer.email}</p>
              </div>
              <Badge
                variant="outline"
                className={statusConfig[customer.status as keyof typeof statusConfig].color}
              >
                {statusConfig[customer.status as keyof typeof statusConfig].label}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total gastado</p>
                  <p className="font-semibold text-emerald-300">
                    {formatCurrency(customer.totalSpent, "CLP")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pedidos</p>
                  <p className="font-semibold text-slate-100">{customer.totalOrders}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  {customer.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  Último pedido: {formatDate(customer.lastOrder)}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-slate-800 bg-slate-900">
                    <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-slate-100">
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar email
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-slate-100">
                      <MapPin className="mr-2 h-4 w-4" />
                      Ver direcciones
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-slate-100">
                      Ver historial de pedidos
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-slate-300 focus:bg-slate-800 focus:text-slate-100"
                      onClick={() => handleSetAdmin(customer.email)}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Convertir en administrador
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-400 focus:bg-red-500/10 focus:text-red-300"
                      onClick={() => handleDeleteUser(customer.email)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar usuario
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
