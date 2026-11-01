# Yougata Shop — V16 (Winter Edition)

Site statique prêt à déployer sur GitHub et Vercel. Nouvelle identité Yougata (rouge, vert sapin, ambiance hivernale), logo SVG original, offres 14 boosts à 2,60 € et 28 boosts à 5,20 €.

## Important — sécurité et paiements
- Les paiements restent en **démonstration** : aucun prestataire n’est connecté, aucune transaction n’est surveillée et aucune commande ne doit être considérée payée.
- Le calcul des cours crypto est **indicatif**, pas une facture avec taux garanti.
- Le DM Discord **de test** fonctionne uniquement avec `DISCORD_BOT_TOKEN` et `ADMIN_TEST_SECRET` définis sur Vercel. L’endpoint `/api/discord-test` requiert un POST authentifié.
- N’ajoutez jamais de secrets à GitHub, ni dans les fichiers HTML/JS.
- La route `/api/payment-webhook` est un placeholder désactivé ; n’activez pas de confirmation de paiement sans prestataire et validation cryptographique des webhooks.
- Le fichier `vercel.json` applique des en-têtes de sécurité, contre certains risques courants (anti-iframe, MIME, HTTPS, permissions). Une CSP stricte nécessitera de supprimer les styles inline existants.
- Contrôlez le déploiement sur Vercel et testez le parcours après installation.

## Installation
1. Décompresser ce ZIP et copier tous les fichiers, y compris `api/`, à la racine du dépôt GitHub.
2. Déployer sur Vercel.
3. Vérifier la page d’accueil, les deux prix, les formulaires, les cours indicatifs et le test Discord.

Le logo Yougata est un SVG original créé pour ce site ; il n’est pas une copie du visuel de référence.
