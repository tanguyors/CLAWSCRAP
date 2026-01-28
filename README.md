# MoltyTouch - Site de Promotion Crypto

Site web moderne pour promouvoir le token crypto $MOLTYVOUCH avec scraping Twitter en temps réel.

## 🚀 Fonctionnalités

- **Design Ultra Moderne** : Interface avec glassmorphism et animations fluides
- **Scraping Twitter** : Recherche et affichage de tweets en temps réel
- **API Twitter** : Intégration avec Twitter API v2
- **Responsive** : Design adaptatif pour mobile et desktop
- **Logo Personnalisé** : Logo 3D intégré avec effets visuels

## 📦 Installation Locale

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditez .env et ajoutez vos clés API Twitter

# Lancer le serveur de développement
npm run dev

# Ou lancer en production
npm start
```

Le site sera accessible sur `http://localhost:3001`

## 🌐 Déploiement sur Vercel

Voir le guide complet dans [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

### Déploiement Rapide

1. **Préparer Git** :
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Créer un dépôt GitHub** et pousser le code

3. **Sur Vercel** :
   - Importez votre dépôt GitHub
   - Configurez les variables d'environnement (TWITTER_BEARER_TOKEN, etc.)
   - Déployez !

## 🔑 Variables d'Environnement

Créez un fichier `.env` avec :

```env
TWITTER_BEARER_TOKEN=votre_bearer_token
TWITTER_API_KEY=votre_api_key
TWITTER_API_SECRET=votre_api_secret
PORT=3001
```

## 📁 Structure du Projet

```
├── api/                 # Serverless functions pour Vercel
│   └── index.js
├── public/              # Frontend (fichiers statiques)
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── logo.png
├── scraper/             # Logique de scraping Twitter
│   └── twitterScraper.js
├── server.js            # Serveur Express (local)
├── vercel.json          # Configuration Vercel
└── package.json
```

## 🛠️ Technologies Utilisées

- **Frontend** : HTML5, CSS3 (Glassmorphism), JavaScript
- **Backend** : Node.js, Express.js
- **API** : Twitter API v2
- **Scraping** : Axios, Cheerio
- **Hébergement** : Vercel (Serverless)

## 📝 Notes

- Le fichier `.env` ne doit JAMAIS être commité (déjà dans `.gitignore`)
- Pour le déploiement sur Vercel, configurez les variables d'environnement dans le dashboard
- Les routes API sont gérées par les serverless functions sur Vercel

## 📄 Licence

MIT
