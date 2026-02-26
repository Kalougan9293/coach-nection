# Coach-Nection V2

Site vitrine pour l'agence de recrutement sportif Coach-Nection. Refonte moderne avec Next.js 14 (App Router), React, Tailwind CSS.

## Design System

- **Couleur Primaire** : `#1F2957` (Bleu foncé)
- **Couleur Secondaire** : `#D4DC53` (Jaune citron)
- **Couleur d'accent** : `#003399` (Bleu roi)
- **Fond** : `#F3F0EB` (Beige clair)
- **Typographie** : Montserrat (Google Font)

## Structure du projet

```
src/
├── app/
│   ├── page.tsx              # Page d'accueil
│   ├── admin/                # Dashboard admin
│   │   ├── page.tsx          # Liste des coachs
│   │   └── recruteurs/      # Liste des recruteurs/annonces
│   └── formulaire/
│       ├── coach/            # Formulaire d'inscription coach
│       └── recruteur/       # Formulaire recruteur
├── components/
│   ├── layout/              # Header, Footer
│   ├── home/                # Sections de la landing
│   ├── forms/               # Formulaires multi-étapes
│   └── admin/               # Sidebar, DataGrid
```

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Pages

- **/** - Landing page (Hero, Stats, Comment ça marche, Coachs, Annonces)
- **/formulaire/coach** - Formulaire d'inscription coach (2 étapes)
- **/formulaire/recruteur** - Formulaire recruteur (2 étapes)
- **/admin** - Dashboard admin (Coachs)
- **/admin/recruteurs** - Recruteurs et annonces

## Prochaines étapes

- Connexion Supabase pour la persistance des données
- Authentification admin
- Validation des formulaires
- Intégration des vrais logos
