import { PrismaClient } from "../src/generated/prisma";

import { seedBrands, seedCategories, seedProducts } from "../src/data/seed-data";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Iniciando proceso de seed...");

  // 🔹 Seed de marcas
  for (const brand of seedBrands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {
        name: brand.name,
        logoUrl: brand.logoUrl,
        website: brand.website,
      },
      create: brand,
    });
  }
  console.log(`✅ ${seedBrands.length} marcas agregadas o actualizadas.`);

  // 🔹 Seed de categorías
  for (const category of seedCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
      },
      create: category,
    });
  }
  console.log(`✅ ${seedCategories.length} categorías agregadas o actualizadas.`);

  // 🔹 Seed de productos
  for (const product of seedProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        highlights: product.highlights ?? undefined,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? undefined,
        stock: product.stock,
        weight: product.weight ?? undefined,
        featured: product.featured,
        isActive: product.isActive,
        tags: product.tags,
        rating: product.rating ?? undefined,
        reviewCount: product.reviewCount ?? undefined,
      },
      create: {
        ...product,
        // 🧩 Prisma 6 exige objetos planos en nested writes, no copiar el .create entero
        categories: product.categories
          ? {
              create: product.categories.create.map((item) => ({
                category: { connect: item.category.connect },
              })),
            }
          : undefined,
        images: product.images
          ? {
              create: product.images.create.map((img) => ({
                url: img.url,
                alt: img.alt ?? undefined,
                isPrimary: img.isPrimary ?? false,
              })),
            }
          : undefined,
        specifications: product.specifications
          ? {
              create: product.specifications.create.map((spec) => ({
                name: spec.name,
                value: spec.value,
              })),
            }
          : undefined,
      },
    });
  }
  console.log(`✅ ${seedProducts.length} productos agregados o actualizados.`);

  console.log("🎉 Seed completado con éxito.");
}

seed()
  .catch((error) => {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
