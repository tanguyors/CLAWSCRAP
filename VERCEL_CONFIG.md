# ⚙️ Configuration Vercel - Guide Rapide

## 🔧 Configuration dans Vercel Dashboard

### Settings → General

1. **Root Directory** : `./` (laisser vide)
2. **Build Command** : (laisser vide)
3. **Output Directory** : `public` ⚠️ **TRÈS IMPORTANT !**
4. **Install Command** : `npm install`
5. **Development Command** : (laisser vide)

### Settings → Environment Variables

Ajoutez ces 3 variables :
- `TWITTER_BEARER_TOKEN` = votre token
- `TWITTER_API_KEY` = votre clé API  
- `TWITTER_API_SECRET` = votre secret API

**Important** : Cochez toutes les cases (Production, Preview, Development)

## 📁 Structure des Fichiers

```
CLAWSCRAP/
├── api/
│   ├── scrape.js              # POST /api/scrape
│   └── stats/
│       └── [keyword].js      # GET /api/stats/:keyword
├── public/                    # Frontend (servi automatiquement)
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── logo.png
├── scraper/
│   └── twitterScraper.js
├── vercel.json
└── package.json
```

## 🚀 Après Modification

1. **Commit et Push** :
```bash
git add .
git commit -m "Fix Vercel config"
git push
```

2. **OU Redéployer manuellement** dans Vercel Dashboard

## ✅ Vérification

Après déploiement, testez :
- `https://clawscrap.vercel.app/` → Doit afficher la page
- `https://clawscrap.vercel.app/api/scrape` → Doit répondre (POST uniquement)
- `https://clawscrap.vercel.app/api/stats/MOLTYVOUCH` → Doit retourner des stats

## 🐛 Si ça ne marche toujours pas

1. Vérifiez les **logs** dans Vercel Dashboard → **Functions**
2. Vérifiez que **Output Directory = `public`** (sans slash)
3. Vérifiez que les variables d'environnement sont bien configurées
4. Redéployez après chaque modification de configuration
