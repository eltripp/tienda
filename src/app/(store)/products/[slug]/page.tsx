import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { getProductBySlug } from "@/server/products";
import { ProductDetailActions } from "@/components/products/product-detail-actions";
import { formatCurrency } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Producto no encontrado | Tech Nova",
    };
  }
  return {
    title: `${product.name} | Tech Nova`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const mainImage = product.images[0];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 sm:px-10">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-slate-950">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt ?? product.name}
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid aspect-video place-items-center text-sm text-slate-500">Sin imagen</div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.slice(0, 4).map((image) => (
              <div key={image.id} className="relative h-24 overflow-hidden rounded-2xl border border-slate-900">
                <Image src={image.url} alt={image.alt ?? product.name} fill sizes="100px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">{product.brand?.name ?? "Tech Nova"}</p>
            <h1 className="font-heading text-3xl text-slate-100 sm:text-4xl">{product.name}</h1>
            <p className="text-sm text-slate-400">{product.description}</p>
          </div>
          <div className="space-y-2 rounded-2xl border border-slate-900/60 bg-slate-950/70 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Precio</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-semibold text-emerald-400">{formatCurrency(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-slate-500 line-through">{formatCurrency(product.compareAtPrice)}</span>
              )}
            </div>
            {product.highlights && <p className="text-sm text-slate-300">{product.highlights}</p>}
          </div>
          <ProductDetailActions productId={product.id} slug={product.slug} />
          <div className="space-y-3">
            <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500">Especificaciones</h2>
            <ul className="grid gap-2 text-sm text-slate-300">
              {product.specifications?.map((spec) => (
                <li key={spec.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-900/60 bg-slate-900/40 px-3 py-2">
                  <span className="text-slate-400">{spec.name}</span>
                  <span className="text-slate-100">{spec.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
