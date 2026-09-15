export type Role = "eleveur" | "acheteur" | "admin";
export type KycStatus = "non_soumis" | "en_attente" | "valide" | "refuse";
export type HealthStatus = "sain" | "vaccine" | "en_observation";
export type ListingStatus = "disponible" | "reserve" | "vendu";
export type TransactionStatus = "sequestre" | "confirme" | "litige" | "rembourse";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  phone: string;
  location: string;
  kycStatus: KycStatus;
  badges: string[];
  createdAt: string;
}

export interface CommissionTier {
  maxPrice: number | null; // null = pas de plafond
  rate: number; // ex 0.05 = 5%
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  commissionTiers: CommissionTier[];
}

export interface Listing {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  healthStatus: HealthStatus;
  age: string;
  breed: string;
  images: string[];
  status: ListingStatus;
  featured: boolean;
  createdAt: string;
}

export interface Article {
  id: string;
  authorId: string;
  title: string;
  excerpt: string;
  content: string;
  theme: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  commission: number;
  status: TransactionStatus;
  createdAt: string;
  confirmedAt: string | null;
}

export interface Review {
  id: string;
  transactionId: string;
  authorId: string;
  targetId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ArticleComment {
  id: string;
  articleId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Database {
  users: User[];
  categories: Category[];
  listings: Listing[];
  articles: Article[];
  transactions: Transaction[];
  reviews: Review[];
  comments: ArticleComment[];
}
