import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type { Database } from "./types";

// Sur les plateformes serverless (Vercel...), le répertoire du projet est en
// lecture seule : seul /tmp est inscriptible, mais il n'est pas garanti
// persistant entre deux invocations. On l'utilise quand même en production
// pour permettre une démo fonctionnelle (inscription, dépôt d'annonce...),
// avec ce compromis assumé. En local (npm run dev / npm run start), on écrit
// dans ./data pour une vraie persistance entre redémarrages.
const DATA_DIR =
  process.env.VERCEL || process.env.NODE_ENV === "production"
    ? path.join("/tmp", "agrimarket-data")
    : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

function buildSeed(): Database {
  const now = new Date();
  const daysAgo = (n: number) =>
    new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

  const passwordHash = bcrypt.hashSync("demo1234", 8);

  const users: Database["users"] = [
    {
      id: "u-admin",
      name: "Admin AgriMarket",
      email: "admin@agrimarket.bj",
      passwordHash,
      role: "admin",
      phone: "+229 90 00 00 01",
      location: "Parakou",
      kycStatus: "valide",
      badges: ["equipe"],
      createdAt: daysAgo(400),
    },
    {
      id: "u-eleveur-1",
      name: "Idrissou Baba",
      email: "idrissou.baba@agrimarket.bj",
      passwordHash,
      role: "eleveur",
      phone: "+229 97 12 34 56",
      location: "Parakou",
      kycStatus: "valide",
      badges: ["eleveur_verifie", "vaccination_a_jour"],
      createdAt: daysAgo(220),
    },
    {
      id: "u-eleveur-2",
      name: "Rachidatou Séro",
      email: "rachidatou.sero@agrimarket.bj",
      passwordHash,
      role: "eleveur",
      phone: "+229 96 65 43 21",
      location: "Nikki",
      kycStatus: "en_attente",
      badges: [],
      createdAt: daysAgo(60),
    },
    {
      id: "u-acheteur-1",
      name: "Fabrice Kora",
      email: "fabrice.kora@agrimarket.bj",
      passwordHash,
      role: "acheteur",
      phone: "+229 91 22 33 44",
      location: "Cotonou",
      kycStatus: "valide",
      badges: [],
      createdAt: daysAgo(140),
    },
  ];

  const categories: Database["categories"] = [
    {
      id: "c-bovins",
      name: "Bovins",
      slug: "bovins",
      commissionTiers: [
        { maxPrice: 150000, rate: 0.07 },
        { maxPrice: 400000, rate: 0.05 },
        { maxPrice: null, rate: 0.035 },
      ],
    },
    {
      id: "c-ovins-caprins",
      name: "Ovins & caprins",
      slug: "ovins-caprins",
      commissionTiers: [
        { maxPrice: 30000, rate: 0.08 },
        { maxPrice: 80000, rate: 0.06 },
        { maxPrice: null, rate: 0.04 },
      ],
    },
    {
      id: "c-volailles",
      name: "Volailles",
      slug: "volailles",
      commissionTiers: [
        { maxPrice: 10000, rate: 0.1 },
        { maxPrice: null, rate: 0.07 },
      ],
    },
    {
      id: "c-porcins",
      name: "Porcins",
      slug: "porcins",
      commissionTiers: [
        { maxPrice: 60000, rate: 0.07 },
        { maxPrice: null, rate: 0.05 },
      ],
    },
  ];

  const listings: Database["listings"] = [
    {
      id: "l-1",
      sellerId: "u-eleveur-1",
      categoryId: "c-bovins",
      title: "Taurillon Borgou, 18 mois",
      description:
        "Taurillon de race Borgou élevé en pâturage libre, bon état sanitaire, carnet de vaccination à jour. Idéal pour engraissement ou reproduction.",
      price: 285000,
      location: "Parakou",
      healthStatus: "vaccine",
      age: "18 mois",
      breed: "Borgou",
      images: ["taurillon-borgou.jpg"],
      status: "disponible",
      featured: true,
      createdAt: daysAgo(5),
    },
    {
      id: "l-2",
      sellerId: "u-eleveur-1",
      categoryId: "c-ovins-caprins",
      title: "Bélier Djallonké robuste",
      description:
        "Bélier reproducteur, gabarit au-dessus de la moyenne, très recherché pour la reproduction en petit élevage familial.",
      price: 45000,
      location: "Parakou",
      healthStatus: "sain",
      age: "14 mois",
      breed: "Djallonké",
      images: ["belier-djallonke.jpg"],
      status: "disponible",
      featured: false,
      createdAt: daysAgo(9),
    },
    {
      id: "l-3",
      sellerId: "u-eleveur-2",
      categoryId: "c-volailles",
      title: "Lot de 20 poulets locaux",
      description:
        "Lot de poulets locaux élevés en semi-liberté, croissance naturelle sans antibiotique de croissance.",
      price: 60000,
      location: "Nikki",
      healthStatus: "sain",
      age: "4 mois",
      breed: "Poulet local",
      images: ["poulets-locaux.jpg"],
      status: "disponible",
      featured: true,
      createdAt: daysAgo(2),
    },
    {
      id: "l-4",
      sellerId: "u-eleveur-2",
      categoryId: "c-porcins",
      title: "Porc charcutier 90 kg",
      description:
        "Porc prêt à l'abattage, alimentation contrôlée, suivi vétérinaire régulier.",
      price: 135000,
      location: "Nikki",
      healthStatus: "en_observation",
      age: "8 mois",
      breed: "Large White croisé",
      images: ["porc-charcutier.jpg"],
      status: "reserve",
      featured: false,
      createdAt: daysAgo(14),
    },
    {
      id: "l-5",
      sellerId: "u-eleveur-1",
      categoryId: "c-bovins",
      title: "Vache laitière Zébu Peul",
      description:
        "Vache en 2ème lactation, bonne production laitière quotidienne, tempérament calme.",
      price: 420000,
      location: "Parakou",
      healthStatus: "vaccine",
      age: "4 ans",
      breed: "Zébu Peul",
      images: ["vache-zebu.jpg"],
      status: "vendu",
      featured: false,
      createdAt: daysAgo(30),
    },
  ];

  const articles: Database["articles"] = [
    {
      id: "a-1",
      authorId: "u-admin",
      title: "Prévenir la salmonellose aviaire en saison des pluies",
      excerpt:
        "Les gestes simples de biosécurité qui réduisent fortement le risque dans les petits élevages avicoles.",
      content:
        "La salmonellose aviaire progresse en saison des pluies à cause de l'humidité et de la promiscuité dans les poulaillers. Un nettoyage régulier des mangeoires, une litière sèche et un contrôle strict de l'accès des visiteurs limitent considérablement la propagation. En cas de mortalité anormale, isolez immédiatement le lot suspect et contactez un vétérinaire avant toute automédication.",
      theme: "Santé animale",
      createdAt: daysAgo(18),
    },
    {
      id: "a-2",
      authorId: "u-admin",
      title: "Bien négocier le prix d'un bovin sur le marché",
      excerpt:
        "Les critères objectifs à vérifier avant de fixer ou d'accepter un prix pour un bovin.",
      content:
        "Le prix d'un bovin dépend de son âge, de sa race, de son état corporel et de son carnet sanitaire. Un acheteur sérieux demande toujours à voir l'animal se déplacer pour juger sa démarche, et vérifie l'absence de blessures ou de boiterie. Un vendeur qui peut présenter un historique de vaccination obtient généralement un meilleur prix.",
      theme: "Commerce",
      createdAt: daysAgo(40),
    },
    {
      id: "a-3",
      authorId: "u-admin",
      title: "Constituer une réserve fourragère avant la saison sèche",
      excerpt:
        "Anticiper le manque de pâturage en stockant du fourrage dès la fin des récoltes.",
      content:
        "La saison sèche réduit drastiquement l'accès au pâturage naturel. Les éleveurs qui anticipent en fauchant et en stockant du fourrage dès la fin des récoltes évitent la perte de poids de leur cheptel et les ventes précipitées à bas prix.",
      theme: "Élevage",
      createdAt: daysAgo(70),
    },
  ];

  return {
    users,
    categories,
    listings,
    articles,
    transactions: [],
    reviews: [],
    comments: [],
  };
}

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const seed = buildSeed();
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2), "utf-8");
  }
}

export function readDb(): Database {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Database;
}

export function writeDb(db: Database): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function newId(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}
