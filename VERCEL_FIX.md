# 🔧 Correction de l'Erreur 404 sur Vercel

## Problème
Votre site affiche une erreur 404 sur Vercel car la configuration n'était pas optimale.

## ✅ Solution Appliquée

J'ai restructuré les fichiers API pour Vercel :

### Structure des fichiers API
```
api/
├── scrape.js           # Route POST /api/scrape
└── stats/
    └── [keyword].js    # Route GET /api/stats/:keyword
```

### Configuration Vercel (vercel.json)
```json
{
  "rewrites": [
    {
      "source": "/api/scrape",
      "destination": "/api/scrape"
    },
    {
      "source": "/api/stats/:keyword",
      "destination": "/api/stats/:keyword"
    }
  ]
}
```

## 🚀 Étapes pour Corriger le Déploiement

### 1. Dans Vercel Dashboard

1. Allez sur votre projet Vercel
2. Cliquez sur **Settings** → **General**
3. Vérifiez la configuration :
   - **Root Directory** : `./` (laisser vide ou mettre `./`)
   - **Build Command** : (laisser vide)
   - **Output Directory** : `public` ⚠️ IMPORTANT !
   - **Install Command** : `npm install`

### 2. Redéployer

Après avoir modifié la configuration :

1. Allez dans **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. Cliquez sur **Redeploy**

OU

1. Faites un nouveau commit et push :
```bash
git add .
git commit -m "Fix Vercel configuration"
git push
```

### 3. Vérifier les Variables d'Environnement

Assurez-vous que vos variables sont bien configurées :
- `TWITTER_BEARER_TOKEN`
- `TWITTER_API_KEY`
- `TWITTER_API_SECRET`

Dans **Settings** → **Environment Variables**

## 📝 Notes Importantes

- **Output Directory** doit être `public` (pas `/public` ni `./public`)
- Les fichiers dans `public/` seront servis automatiquement
- Les routes `/api/*` sont gérées par les fichiers dans `api/`
- Vercel détecte automatiquement les fichiers dans `api/` comme serverless functions

## 🔍 Vérification

Après le redéploiement, votre site devrait être accessible :
- Page principale : `https://clawscrap.vercel.app/`
- API Scrape : `https://clawscrap.vercel.app/api/scrape`
- API Stats : `https://clawscrap.vercel.app/api/stats/MOLTYVOUCH`

Si ça ne fonctionne toujours pas, vérifiez les logs dans Vercel Dashboard → **Functions**.
