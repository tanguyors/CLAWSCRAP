# Guide de Déploiement sur Vercel

Ce guide vous explique comment déployer votre application $MOLTYVOUCH sur Vercel avec le backend et le frontend.

## 📋 Prérequis

1. Un compte GitHub (gratuit)
2. Un compte Vercel (gratuit) - [vercel.com](https://vercel.com)
3. Vos clés API Twitter configurées

## 🚀 Étapes de Déploiement

### 1. Préparer le projet Git

Si vous n'avez pas encore initialisé Git :

```bash
git init
git add .
git commit -m "Initial commit - Ready for Vercel deployment"
```

### 2. Créer un dépôt GitHub

1. Allez sur [github.com](https://github.com)
2. Créez un nouveau dépôt (New Repository)
3. Nommez-le (ex: `moltyvouch-promo`)
4. Ne cochez PAS "Initialize with README"
5. Copiez l'URL du dépôt (ex: `https://github.com/votre-username/moltyvouch-promo.git`)

### 3. Pousser le code sur GitHub

```bash
git remote add origin https://github.com/votre-username/moltyvouch-promo.git
git branch -M main
git push -u origin main
```

### 4. Déployer sur Vercel

#### Option A : Via l'interface Vercel (Recommandé)

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur **"Add New Project"**
3. Importez votre dépôt GitHub
4. Vercel détectera automatiquement la configuration :
   - **Framework Preset** : Other
   - **Root Directory** : `./` (laisser par défaut)
   - **Build Command** : (laisser vide)
   - **Output Directory** : `public` (important !)
5. Cliquez sur **"Environment Variables"**
6. Ajoutez vos variables d'environnement :
   - `TWITTER_BEARER_TOKEN` = votre bearer token
   - `TWITTER_API_KEY` = votre API key
   - `TWITTER_API_SECRET` = votre API secret
   - `PORT` = (optionnel, Vercel gère automatiquement)
7. Cliquez sur **"Deploy"**

#### Option B : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
```

### 5. Configurer les Variables d'Environnement sur Vercel

1. Allez sur votre projet Vercel
2. Cliquez sur **Settings** → **Environment Variables**
3. Ajoutez chaque variable :
   - **Name** : `TWITTER_BEARER_TOKEN`
   - **Value** : votre token
   - **Environments** : Production, Preview, Development (cochez tous)
4. Répétez pour `TWITTER_API_KEY` et `TWITTER_API_SECRET`
5. **Important** : Après avoir ajouté les variables, vous devez redéployer !

## 📁 Structure du Projet pour Vercel

```
CLAWSCRAP/
├── api/
│   └── index.js          # Serverless function pour Vercel
├── public/                # Frontend (servi statiquement)
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── logo.png
├── scraper/
│   └── twitterScraper.js
├── vercel.json           # Configuration Vercel
├── package.json
└── .env                  # (local seulement, pas commité)
```

## 🔧 Configuration Vercel (vercel.json)

Le fichier `vercel.json` configure :
- Les routes API vers `/api/*`
- Les fichiers statiques depuis `/public/*`
- Les rewrites pour le routing

## 🌐 URLs après Déploiement

Après le déploiement, vous obtiendrez :
- **URL de production** : `https://votre-projet.vercel.app`
- **URL de preview** : `https://votre-projet-git-branch.vercel.app`

## 🔄 Mises à Jour

Pour mettre à jour votre site :

```bash
git add .
git commit -m "Description des changements"
git push
```

Vercel redéploiera automatiquement !

## ⚠️ Notes Importantes

1. **Variables d'environnement** : Ne commitez JAMAIS votre fichier `.env` ! Il est déjà dans `.gitignore`
2. **API Routes** : Les routes `/api/*` sont gérées par les serverless functions
3. **Fichiers statiques** : Tout dans `/public` est servi directement
4. **Limites Vercel** :
   - Plan gratuit : 100GB bandwidth/mois
   - Serverless functions : 10s timeout (gratuit), 60s (pro)
   - 100 déploiements/jour (gratuit)

## 🐛 Dépannage

### Les API ne fonctionnent pas
- Vérifiez que les variables d'environnement sont bien configurées
- Redéployez après avoir ajouté les variables
- Vérifiez les logs dans Vercel Dashboard → Functions

### Erreur 404 sur les routes
- Vérifiez que `vercel.json` est bien présent
- Vérifiez la structure des dossiers (`api/index.js` existe)

### Erreur de build
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez les logs de build dans Vercel Dashboard

## 📞 Support

Pour plus d'aide :
- [Documentation Vercel](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
