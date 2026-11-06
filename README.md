# Yougata Shop — version client sans administration

Site client complet (HTML/CSS/JS) et fonctions API Vercel. Pas de page d'administration.

## Déploiement

1. Décompresser et placer **le contenu** de ce dossier à la racine du dépôt GitHub (index.html à la racine).
2. Vercel : Framework Preset = Other, Root Directory = racine du dépôt, puis Deploy.
3. Configurer dans Vercel les variables privées SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY. Ne jamais mettre ces clés dans le code client.
4. Dans Supabase, la table `public.orders` doit comporter les colonnes déjà créées lors des versions précédentes (dont payment_tx_hash, payment_submitted_at, discord_notified_at).
5. Vérifier les parcours de commande et de suivi avec une commande fictive. Ne pas envoyer de cryptomonnaie pour tester.

## Comportement des paiements

- Les adresses BTC/ETH/LTC existantes sont conservées.
- Un TXID fourni par le client passe la commande en `review`, **jamais** en `paid`.
- La consultation d'une transaction sur la blockchain n'est pas une attribution fiable à une commande lorsque plusieurs clients paient une même adresse.
- La validation automatique des paiements et la livraison ne sont **pas activées**. Un service de paiement avec une référence/adresse unique par commande est nécessaire pour un automatisme fiable.
- L'API `notify-paid` est une fonction serveur protégée pour des commandes **déjà** vérifiées et marquées `paid`; elle n'est pas une preuve de paiement.

## Contrôles

- `node --check` sur les fichiers JS (Node.js installé).
- Les secrets sont uniquement dans les variables d'environnement Vercel.
- Ne pas déployer les fichiers de tests locaux ou les archives historiques.
