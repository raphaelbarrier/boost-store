# Yougata Shop — pack consolidé

## Installation
1. Remplacer les fichiers du dépôt GitHub par ceux de ce ZIP, en conservant le dossier `api/`.
2. Déployer sur Vercel et attendre le statut Ready.
3. Vérifier les variables serveur : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TEST_SECRET`, `DISCORD_BOT_TOKEN`, `DISCORD_ADMIN_ID` et éventuellement `SHOP_ORIGIN`. Ne jamais placer ces secrets dans le JavaScript public.
4. Dans Supabase, exécuter les migrations précédentes si elles ne l'ont pas été : colonnes `payment_tx_hash`, `payment_submitted_at`, `payment_confirmed_at`, `discord_notified_at`. Le projet doit disposer des colonnes de base des commandes.
5. Ouvrir `/admin-commandes.html`, saisir `ADMIN_TEST_SECRET` et charger les commandes. La clé n'est pas enregistrée dans le navigateur.

## Flux de traitement
- Client : commande `pending`, saisie TXID => `review`.
- Administrateur : inspecter TXID et vérifier **indépendamment** le réseau, l'adresse, la somme reçue, la date, les confirmations et l'absence d'attribution à une autre commande.
- Après cette vérification seulement : bouton **Approuver** => `paid`.
- Bouton **Envoyer DM Discord** => notification de la commande déjà payée.

## Limites de sécurité importantes
- Les adresses BTC, ETH et LTC restent **partagées** entre clients : un TXID ne prouve pas à lui seul que la transaction appartient au client qui l'a soumis. Ne pas activer d'approbation automatique avec ce modèle.
- Le bouton d'inspection blockchain donne des informations indicatives. Il ne valide pas le taux EUR/crypto, les montants attendus ni la propriété du transfert.
- L'administration utilise une clé secrète commune et une URL publique. Pour une exploitation réelle, mettre en place une authentification administrateur complète, une limitation des requêtes et des journaux d'audit.
- Les appels à Discord et la base ne forment pas une transaction atomique : en cas d'échec réseau après l'envoi du DM, une intervention peut être nécessaire.
- Ne pas utiliser de vraies transactions pour les tests initiaux. Le pack n'est pas une passerelle de paiement crypto autonome.
