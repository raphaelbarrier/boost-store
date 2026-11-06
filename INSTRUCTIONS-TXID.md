# Yougata — TXID vers Discord

1. Envoyer tous les fichiers de ce ZIP à la racine du dépôt GitHub.
2. Exécuter `MIGRATION-TXID.sql` dans Supabase SQL Editor.
3. Vérifier les variables Vercel : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DISCORD_BOT_TOKEN, DISCORD_ADMIN_ID. Ne jamais publier leurs valeurs.
4. Redéployer Vercel.

Le client soumet son TXID sur payment.html. Il peut ensuite demander la vérification via le bouton « Vérifier et transmettre au bot Discord ».
Le serveur recherche la transaction sur la blockchain, exige au moins 2 confirmations et vérifie qu'un montant a été envoyé à l'adresse de la boutique. Si oui, il envoie au maximum une notification de revue par commande au Discord admin.

IMPORTANT : la réception d'un montant sur une adresse partagée ne prouve pas l'attribution du paiement à une commande précise. Aucun statut paid ni livraison automatique ne sont déclenchés. Les confirmations, les frais, les conversions EUR et l'identité du payeur doivent être contrôlés avant livraison.

Limitation : si Discord échoue après réservation de notification, la notification peut être perdue ; il faut une file de tâches et une réconciliation pour garantir la livraison. Ce pack est une étape de test, pas un traitement commercial totalement automatisé.
