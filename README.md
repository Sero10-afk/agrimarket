# AgriMarket

Marketplace de bétail — annonces vérifiées, paiement protégé en séquestre,
conseils d'élevage. Projet de démonstration / portfolio.

**Stack** : Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
· Server Actions · authentification par session JWT (cookie httpOnly) ·
persistance JSON sur disque (pas de base de données externe requise).

## Démarrer en local

Prérequis : Node.js 20+.

```bash
npm install
npm run dev
```

Le site est disponible sur http://localhost:3000. Au premier lancement, un
fichier `data/db.json` est créé automatiquement avec un jeu de données de
démonstration (utilisateurs, catégories, annonces, articles).

### Comptes de démonstration

Mot de passe pour tous les comptes : `demo1234`

| Rôle     | Email                          |
|----------|---------------------------------|
| Éleveur  | idrissou.baba@agrimarket.bj     |
| Éleveur  | rachidatou.sero@agrimarket.bj   |
| Acheteur | fabrice.kora@agrimarket.bj      |
| Admin    | admin@agrimarket.bj             |

### Variables d'environnement

Copier `.env.example` en `.env.local` et définir une vraie valeur pour
`SESSION_SECRET` en production (une chaîne aléatoire longue).

## Fonctionnalités

- **Authentification** : inscription (éleveur / acheteur), connexion,
  déconnexion, session par cookie httpOnly signé (JWT).
- **Catalogue** : filtres par catégorie, prix maximum, localisation, statut
  sanitaire, tri par prix ou par date.
- **Fiche annonce** : détail complet, profil de l'éleveur (badges, note
  moyenne, avis), simulateur de commission transparent avant achat.
- **Achat sécurisé** : le paiement est placé en séquestre à l'achat ; le
  vendeur n'est crédité qu'après confirmation de réception par l'acheteur.
- **Avis** : l'acheteur et le vendeur peuvent noter la transaction une fois
  celle-ci confirmée.
- **Conseils d'élevage** : articles filtrables par thématique, avec
  questions/commentaires des utilisateurs connectés.
- **Tableau de bord par rôle** :
  - Éleveur : gestion de ses annonces et suivi de ses ventes.
  - Acheteur : suivi de ses achats, confirmation de réception, avis.
  - Admin : validation/refus des KYC éleveurs, mise en avant des annonces.
- **Middleware (`proxy.ts`)** : protège `/tableau-de-bord` et
  `/deposer-annonce`, redirection vers `/connexion` si non authentifié.

## Limites connues (projet de démonstration)

- La persistance des données se fait dans un fichier JSON sur disque
  (`data/db.json`), pas dans une vraie base de données — suffisant pour une
  démo, à remplacer par PostgreSQL/Prisma pour un usage en production.
- Les photos d'annonces sont simulées (aucun upload d'image réel).
- Le paiement en séquestre est simulé : aucune intégration avec un vrai
  prestataire de paiement (Mobile Money, Stripe, etc.).

## Build de production

```bash
npm run build
npm run start
```
