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


## V17
- Logo Yougata SVG redessiné ; thème et pied de page harmonisés.
- QR codes inversés en blanc sur fond vert nuit via CSS, même comportement pour BTC, ETH et LTC.
- Neige légèrement plus présente (34 particules) ; titre d’accueil actualisé.
- Mentions de démonstration retirées de l’accueil et du parcours principal, mais information de sécurité conservée sur la page de paiement : aucun prestataire de paiement ni confirmation automatique n’est actif.


## V18 — Supabase : commandes en attente
- `api/create-order.js` crée une commande `pending` côté serveur à la sélection de la crypto.
- Variables Vercel nécessaires : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (secret serveur), et facultativement `SHOP_ORIGIN` (origine autorisée exacte).
- La référence Supabase apparaît dans la page de paiement.
- IMPORTANT : la sélection répétée d'une crypto crée plusieurs commandes `pending` ; une logique de session/idempotence sera nécessaire avant production.
- Aucun paiement n'est surveillé, détecté ou validé automatiquement dans cette version. Le prix crypto affiché reste indicatif et les adresses sont fixes.
- Avant ouverture réelle : ajouter limitation de débit, expiration des commandes, suivi blockchain fiable et rapprochement sans ambiguïté des transactions.
