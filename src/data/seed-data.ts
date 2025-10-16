// @ts-nocheck
import { Prisma } from "@prisma/client";

export const seedBrands: any[] = [
  {
    name: "Nebula Labs",
    slug: "nebula-labs",
    logoUrl:
      "/images/photo-1505740420928-5e560c06d30e.jpg",
    website: "https://nebulalabs.example",
  },
  {
    name: "Aurora Systems",
    slug: "aurora-systems",
    logoUrl:
      "/images/photo-1512495966127-2dc381845d90.jpg",
    website: "https://aurora.example",
  },
  {
    name: "Pulse Audio",
    slug: "pulse-audio",
    logoUrl:
      "/images/photo-1484704849700-f032a568e944.jpg",
    website: "https://pulseaudio.example",
  },
  {
    name: "Zenith Mobile",
    slug: "zenith-mobile",
    logoUrl:
      "/images/photo-1517336714731-489689fd1ca8.jpg",
    website: "https://zenith-mobile.example",
  },
];

export const seedCategories: any[] = [
  {
    name: "Laptops premium",
    slug: "laptops",
    description:
      "Equipos ultrarrápidos para creadores, gamers y profesionales exigentes.",
    imageUrl:
      "/images/photo-1517336714731-489689fd1ca8.jpg",
  },
  {
    name: "Smartphones flagship",
    slug: "smartphones",
    description:
      "Dispositivos inteligentes con cámaras de nivel profesional y baterías de larga duración.",
    imageUrl:
      "/images/photo-1468971050039-be99497410af.jpg",
  },
  {
    name: "Audio inmersivo",
    slug: "audio",
    description:
      "Audífonos, parlantes y soundbars para experiencias envolventes.",
    imageUrl:
      "/images/photo-1505740420928-5e560c06d30e.jpg",
  },
  {
    name: "Accesorios inteligentes",
    slug: "accesorios",
    description: "Monitores, teclados, hubs y todo lo que potencia tu setup.",
    imageUrl:
      "/images/photo-1517430816045-df4b7de11d1d.jpg",
  },
];

export const seedProducts: any[] = [
  {
    name: "Nebula X15 Pro",
    slug: "nebula-x15-pro",
    description:
      'Laptop ultraligera con procesador Intel Core i9 de 14ª generación, GPU RTX 4080 y pantalla Mini-LED de 16" a 165Hz.',
    highlights:
      "Teclado RGB personalizable, carga rápida de 140W y sistema de refrigeración líquido-vapor.",
    price: 2899.99,
    compareAtPrice: 3199.99,
    stock: 24,
    sku: "NBX15P-4080",
    weight: 1.8,
    featured: true,
    isActive: true,
    tags: ["laptop", "gaming", "creadores"],
    rating: 4.8,
    reviewCount: 124,
    brand: { connect: { slug: "nebula-labs" } },
    categories: {
      create: [{ category: { connect: { slug: "laptops" } } }],
    },
    images: {
      create: [
        {
          url: "/images/photo-1484704849700-f032a568e944.jpg",
          alt: "Nebula X15 Pro laptop",
          isPrimary: true,
        },
        {
          url: "/images/photo-1481277542470-605612bd2d61.jpg",
          alt: "Nebula X15 Pro teclado iluminado",
        },
      ],
    },
    specifications: {
      create: [
        { name: "CPU", value: "Intel Core i9-14900HX (24 núcleos)" },
        { name: "GPU", value: "NVIDIA GeForce RTX 4080 12GB GDDR6" },
        { name: "Pantalla", value: '16" Mini-LED QHD+ 165Hz' },
        { name: "RAM", value: "32GB DDR5 6400 MHz" },
        { name: "Almacenamiento", value: "2TB NVMe PCIe 4.0 SSD" },
      ],
    },
  },
  {
    name: "Aurora AIR Flex",
    slug: "aurora-air-flex",
    description:
      "Convertible 2 en 1 con pantalla táctil OLED, autonomía de 20 horas y conectividad Wi-Fi 7.",
    highlights:
      "Modo studio, lápiz magnético y sensor de huella bajo pantalla.",
    price: 1899.0,
    stock: 42,
    sku: "AUR-AIRFLEX",
    weight: 1.2,
    featured: true,
    isActive: true,
    tags: ["productividad", "2-en-1"],
    rating: 4.6,
    reviewCount: 87,
    brand: { connect: { slug: "aurora-systems" } },
    categories: {
      create: [{ category: { connect: { slug: "laptops" } } }],
    },
    images: {
      create: [
        {
          url: "/images/photo-1527449998745-52f3d242617c.jpg",
          alt: "Aurora AIR Flex convertible",
          isPrimary: true,
        },
      ],
    },
    specifications: {
      create: [
        { name: "Pantalla", value: '13.5" OLED táctil 120Hz' },
        { name: "CPU", value: "Intel Core Ultra 7" },
        { name: "RAM", value: "24GB LPDDR5X" },
        { name: "Peso", value: "1.2kg" },
      ],
    },
  },
  {
    name: "Zenith One HyperVision",
    slug: "zenith-one-hypervision",
    description:
      "Smartphone flagship con cámara cuádruple de 200MP y sensor LIDAR para AR inmersiva.",
    highlights:
      "Pantalla AMOLED 6.8\" 1-120Hz, batería 5200mAh, carga 65W, resistencia IP68.",
    price: 1499.99,
    compareAtPrice: 1599.99,
    stock: 60,
    sku: "ZEN-ONE-HYPER",
    weight: 0.21,
    featured: true,
    isActive: true,
    tags: ["smartphone", "5g"],
    rating: 4.7,
    reviewCount: 203,
    brand: { connect: { slug: "zenith-mobile" } },
    categories: {
      create: [{ category: { connect: { slug: "smartphones" } } }],
    },
    images: {
      create: [
        {
          url: "/images/photo-1512499617640-c2f999098c00.jpg",
          alt: "Zenith One HyperVision smartphone",
          isPrimary: true,
        },
      ],
    },
    specifications: {
      create: [
        { name: "Pantalla", value: '6.8" AMOLED LTPO 120Hz' },
        { name: "Cámara principal", value: "200MP ƒ/1.6 con OIS" },
        { name: "Procesador", value: "Zenith Quantum X3" },
        { name: "Resistencia", value: "IP68 + Gorilla Glass Victus 3" },
      ],
    },
  },
  {
    name: "Pulse Resonance X",
    slug: "pulse-resonance-x",
    description:
      "Audífonos inalámbricos con cancelación adaptativa de 4 niveles y audio espacial dinámico.",
    highlights:
      "Hasta 32 horas de autonomía, carga rápida USB-C y multipunto inteligente.",
    price: 349.99,
    stock: 120,
    sku: "PUL-RESON-X",
    weight: 0.055,
    featured: true,
    isActive: true,
    tags: ["audio", "anc"],
    rating: 4.9,
    reviewCount: 312,
    brand: { connect: { slug: "pulse-audio" } },
    categories: {
      create: [{ category: { connect: { slug: "audio" } } }],
    },
    images: {
      create: [
        {
          url: "/images/photo-1516116216624-53e697fedbea.jpg",
          alt: "Pulse Resonance X earbuds",
          isPrimary: true,
        },
      ],
    },
    specifications: {
      create: [
        { name: "Autonomía", value: "32h con estuche" },
        { name: "Carga", value: "USB-C + Qi inalámbrica" },
        { name: "Resistencia", value: "IPX5" },
        { name: "Audio espacial", value: "3D multi-device adaptativo" },
      ],
    },
  },
  {
    name: "Aurora Studio Display 5K",
    slug: "aurora-studio-display-5k",
    description:
      'Monitor 5K NanoGlass de 27" con HDR 1000, 120Hz y hub Thunderbolt 4 integrado.',
    highlights:
      "6 altavoces con Spatial Sound, webcam 4K con autoencuadre y ajuste de altura neumático.",
    price: 1999.0,
    stock: 15,
    sku: "AUR-DISP-5K",
    weight: 6.5,
    tags: ["monitor", "creadores"],
    brand: { connect: { slug: "aurora-systems" } },
    categories: {
      create: [{ category: { connect: { slug: "accesorios" } } }],
    },
    images: {
      create: [
        {
          url: "/images/photo-1498050108023-c5249f4df085.jpg",
          alt: "Aurora Studio Display 5K",
          isPrimary: true,
        },
      ],
    },
    specifications: {
      create: [
        { name: "Resolución", value: "5120 x 2880 (5K)" },
        { name: "Brillo", value: "1000 nits HDR" },
        { name: "Conectividad", value: "Thunderbolt 4 + 3x USB-C 10Gbps" },
      ],
    },
  },
  {
    name: "Zenith Nexus Fold",
    slug: "zenith-nexus-fold",
    description:
      'Smartphone plegable con bisagra de carbono y pantalla sin pliegue de 7.9".',
    highlights:
      "Modo escritorio, stylus magnético y ecosistema de productividad ZenithOS.",
    price: 2199.99,
    stock: 30,
    sku: "ZEN-NEXUS-FOLD",
    tags: ["smartphone", "foldable"],
    brand: { connect: { slug: "zenith-mobile" } },
    categories: {
      create: [{ category: { connect: { slug: "smartphones" } } }],
    },
    images: {
      create: [
        {
          url: "/images/photo-1612467298985-afaae43bc8a3.jpg",
          alt: "Zenith Nexus Fold smartphone plegable",
          isPrimary: true,
        },
      ],
    },
    specifications: {
      create: [
        { name: "Pantalla interna", value: '7.9" AMOLED Flex 120Hz' },
        { name: "Pantalla externa", value: '6.4" AMOLED 120Hz' },
        { name: "Bisagra", value: "CarbonFlex 4ª gen" },
      ],
    },
  },
  {
    name: "Pulse Arc Soundbar",
    slug: "pulse-arc-soundbar",
    description:
      "Soundbar Dolby Atmos con calibración acústica automática y subwoofer inalámbrico.",
    highlights:
      "Control por voz integrado, Bluetooth LE Audio y kit de parlantes surround opcional.",
    price: 799.99,
    stock: 45,
    sku: "PUL-ARC-SB",
    tags: ["audio", "home theater"],
    brand: { connect: { slug: "pulse-audio" } },
    categories: {
      create: [{ category: { connect: { slug: "audio" } } }],
    },
    images: {
      create: [
        {
          url: "/images/photo-1617082280900-5b448016ed36.jpg",
          alt: "Pulse Arc Soundbar en sala moderna",
          isPrimary: true,
        },
      ],
    },
    specifications: {
      create: [
        { name: "Canales", value: "11.1.4 Dolby Atmos" },
        { name: "Conectividad", value: "HDMI 2.1 eARC, Wi-Fi 6, Bluetooth LE" },
        { name: "Calibración", value: "PulseSense Adapt EQ" },
      ],
    },
  },
  {
    name: "Nebula Stream Deck",
    slug: "nebula-stream-deck",
    description:
      "Dock modular Thunderbolt 4 con GPU externa RTX 4060 y puertos 2.5GbE duales.",
    highlights:
      "Expansión instantánea de puertos, soporte triple monitor y carga 180W.",
    price: 1399.0,
    stock: 18,
    sku: "NEB-STRM-DCK",
    tags: ["accesorios", "gaming"],
    brand: { connect: { slug: "nebula-labs" } },
    categories: {
      create: [{ category: { connect: { slug: "accesorios" } } }],
    },
    images: {
      create: [
        {
          url: "/images/photo-1483478550801-ceba5fe50e8e.jpg",
          alt: "Nebula Stream Deck",
          isPrimary: true,
        },
      ],
    },
    specifications: {
      create: [
        { name: "GPU interna", value: "NVIDIA RTX 4060 8GB" },
        { name: "Puertos", value: "2x TB4, 3x USB-C 20Gbps, 2x USB-A" },
        { name: "Red", value: "Dual 2.5GbE + Wi-Fi 7" },
      ],
    },
  },
];
