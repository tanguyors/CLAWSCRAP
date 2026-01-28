# $MOLTYVOUCH - Site de Promotion avec Scraping Twitter

Site web moderne pour promouvoir le token crypto $MOLTYVOUCH avec fonctionnalité de scraping Twitter en temps réel.

## 🚀 Fonctionnalités

- **Scraping Twitter** : Récupération des tweets liés à un mot-clé crypto
- **Statistiques en temps réel** : Analyse des métriques (likes, retweets, réponses)
- **Interface moderne** : Design élégant et responsive
- **Recherche dynamique** : Recherchez n'importe quel token crypto

## 📦 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Copier le fichier d'environnement :
```bash
copy .env.example .env
```

3. (Optionnel) Configurer les credentials Twitter API dans `.env` pour utiliser la vraie API Twitter

## 🎯 Utilisation

Démarrer le serveur :
```bash
npm start
```

Ou en mode développement avec auto-reload :
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## 🔧 Configuration

### Utiliser la vraie API Twitter

Pour utiliser l'API Twitter officielle, vous devez :

1. Créer un compte développeur Twitter : https://developer.twitter.com/
2. Créer une application et obtenir vos credentials
3. Ajouter vos tokens dans le fichier `.env` :
   ```
   TWITTER_BEARER_TOKEN=votre_token_ici
   ```

4. Modifier `scraper/twitterScraper.js` pour utiliser l'API Twitter v2

## 📝 Structure du Projet

```
CLAWSCRAP/
├── server.js              # Serveur Express
├── scraper/
│   └── twitterScraper.js  # Logique de scraping Twitter
├── public/
│   ├── index.html         # Page principale
│   ├── styles.css         # Styles CSS
│   └── app.js            # JavaScript frontend
├── package.json
└── README.md
```

## 🎨 Personnalisation

- Modifiez les couleurs dans `public/styles.css` (variables CSS dans `:root`)
- Personnalisez le contenu dans `public/index.html`
- Ajustez la logique de scraping dans `scraper/twitterScraper.js`

## 📄 Licence

MIT
