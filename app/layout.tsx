import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AgriMarket — Le marché du bétail, en confiance",
  description:
    "AgriMarket connecte éleveurs, acheteurs et conseillers vétérinaires autour d'un marché du bétail sécurisé au Bénin : annonces vérifiées, paiement en séquestre, conseils d'élevage.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
