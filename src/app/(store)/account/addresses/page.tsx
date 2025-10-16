const addresses = [
  {
    label: "Casa",
    recipient: "Danilo Andrade",
    street: "Avenida Las Condes 1234",
    commune: "Las Condes",
    region: "RM",
    phone: "+56 9 9123 4567",
    isDefault: true,
  },
  {
    label: "Oficina",
    recipient: "Danilo Andrade",
    street: "Isidora Goyenechea 3200",
    commune: "Las Condes",
    region: "RM",
    phone: "+56 2 2345 6789",
    isDefault: false,
  },
];

export default function AccountAddressesPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {addresses.map((address) => (
        <div
          key={address.label}
          className="space-y-2 rounded-2xl border border-slate-900/70 bg-slate-950/60 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="font-heading text-lg text-slate-100">{address.label}</p>
            {address.isDefault && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                Principal
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300">{address.recipient}</p>
          <p className="text-sm text-slate-400">
            {address.street}, {address.commune}, {address.region}
          </p>
          <p className="text-sm text-slate-400">{address.phone}</p>
        </div>
      ))}
    </div>
  );
}
