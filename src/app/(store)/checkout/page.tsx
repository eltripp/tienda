import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";

export default function CheckoutPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:px-10 lg:flex-row lg:gap-12">
      <div className="flex-1 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Paso final</p>
          <h1 className="font-heading text-3xl text-slate-100 sm:text-4xl">Confirma tu pedido</h1>
          <p className="text-sm text-slate-400">
            Completa tus datos de envio y nos encargamos del resto. Tu informacion esta protegida.
          </p>
        </div>
        <CheckoutForm />
      </div>
      <div className="w-full max-w-md flex-shrink-0">
        <CheckoutSummary />
      </div>
    </main>
  );
}
