# Prise de Note

Ceci est une application de prise de notes moderne et intuitive développée avec [Next.js](https://nextjs.org). L'application permet aux utilisateurs de créer, gérer et organiser leurs notes personnelles avec une interface utilisateur élégante et réactive.

## Fonctionnalités

- **Création et édition de notes** : Créez facilement de nouvelles notes et modifiez-les avec un éditeur riche (EditorJS)
- **Organisation intuitive** : Visualisez et gérez toutes vos notes dans une interface claire
- **Authentification sécurisée** : Protégez vos notes avec un système d'authentification robuste
- **Interface responsive** : Utilisez l'application sur tous vos appareils
- **Stockage persistant** : Vos notes sont sauvegardées dans une base de données

## Démarrage

Premièrement, lancez le serveur de développement :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur pour voir le résultat.

Vous pouvez commencer à éditer la page en modifiant `app/page.tsx`. La page se met à jour automatiquement lorsque vous modifiez le fichier.

Ce projet utilise [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) pour optimiser et charger automatiquement [Geist](https://vercel.com/font), une nouvelle famille de polices pour Vercel.

## Technologies utilisées

- **Frontend** : Next.js, React, Tailwind CSS
- **Backend** : API Routes de Next.js
- **Base de données** : Prisma avec SQLite
- **Authentification** : JWT (JSON Web Tokens)
- **Éditeur de texte** : EditorJS

## En savoir plus

Pour en savoir plus sur Next.js, consultez les ressources suivantes :

- [Documentation Next.js](https://nextjs.org/docs) - découvrez les fonctionnalités et l'API de Next.js.
- [Apprendre Next.js](https://nextjs.org/learn) - un tutoriel interactif Next.js.

Vous pouvez consulter [le dépôt GitHub de Next.js](https://github.com/vercel/next.js) - vos commentaires et contributions sont les bienvenus !

## Déploiement sur Vercel

La façon la plus simple de déployer votre application Next.js est d'utiliser la [Plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) des créateurs de Next.js.

Consultez notre [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.
