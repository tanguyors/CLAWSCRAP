# Guide de Configuration Twitter API

## Problèmes d'Authentification (401/402 Unauthorized/Payment Required)

### Erreur 401 Unauthorized
Si vous rencontrez une erreur 401, cela peut signifier :
- Votre Bearer Token est invalide ou expiré
- Votre compte a atteint son plafond de dépenses
- Votre solde de crédits est insuffisant

### Erreur 402 Payment Required
Si vous rencontrez une erreur 402, cela signifie :
- Un abonnement Twitter API payant est requis (plan gratuit limité)
- Votre solde de crédits est insuffisant
- Votre plafond de dépenses a été atteint

## Solution 1 : Régénérer un Bearer Token

### Étape 1 : Aller sur Twitter Developer Portal
1. Connectez-vous sur https://developer.twitter.com/
2. Allez dans votre projet/app

### Étape 2 : Générer un nouveau Bearer Token
1. Dans votre app, allez dans l'onglet "Keys and tokens"
2. Sous "Bearer Token", cliquez sur "Regenerate" si disponible
3. Copiez le nouveau Bearer Token

### Étape 3 : Mettre à jour le .env
Remplacez la ligne `TWITTER_BEARER_TOKEN` dans votre fichier `.env` :

```
TWITTER_BEARER_TOKEN=votre_nouveau_token_ici
```

**Important** : Si votre token contient des caractères spéciaux comme `+`, `=`, `/`, vous pouvez le laisser tel quel - le système le décode automatiquement.

## Solution 2 : Utiliser API Key et Secret (Génération automatique)

Le système peut automatiquement générer un Bearer Token à partir de votre API Key et Secret.

1. Assurez-vous que `TWITTER_API_KEY` et `TWITTER_API_SECRET` sont dans votre `.env`
2. Le système tentera automatiquement de générer un Bearer Token si le token actuel ne fonctionne pas

## Solution 3 : Vérifier les Permissions de l'App

Assurez-vous que votre app Twitter a les bonnes permissions :

1. Allez sur https://developer.twitter.com/
2. Sélectionnez votre app
3. Vérifiez les "User authentication settings" ou "App permissions"
4. Pour le scraping de tweets publics, vous avez besoin au minimum de "Read" permissions

## Vérification

Après avoir mis à jour votre `.env`, redémarrez le serveur :

```bash
npm start
```

Vous devriez voir :
- `✅ Twitter Bearer Token configuré - API Twitter activée`
- Ou `✅ Bearer Token généré avec succès` si génération automatique

## Gestion des Crédits et Facturation

### Vérifier votre solde
1. Allez sur https://developer.twitter.com/
2. Naviguez vers "Billing" ou "Credits"
3. Vérifiez votre solde restant

### Configurer une méthode de paiement
1. Dans la section "Recharge automatique"
2. Ajoutez au moins une méthode de paiement
3. Activez la recharge automatique pour éviter les interruptions

### Gérer le plafond de dépenses
1. Allez dans "Gérer le Plafond de Dépenses"
2. Définissez un montant maximum par cycle
3. **Important** : Une fois le plafond atteint, les requêtes API seront bloquées jusqu'au prochain cycle

### Acheter des crédits
Si votre solde est faible (< $10), envisagez d'acheter des crédits supplémentaires pour éviter les interruptions.

## Notes Importantes

- Les Bearer Tokens peuvent expirer
- Les limites de taux Twitter sont : 300 requêtes toutes les 15 minutes pour le plan gratuit
- Si vous dépassez les limites, vous verrez une erreur 429
- **Un solde insuffisant ou un plafond atteint peut causer des erreurs 401/402**
- Configurez toujours une méthode de paiement pour éviter les interruptions de service

## Mode Démonstration

Si l'API Twitter n'est pas disponible, le système utilisera automatiquement des données de démonstration réalistes pour que le site continue de fonctionner.
