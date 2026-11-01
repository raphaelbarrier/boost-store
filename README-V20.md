# Yougata Shop V20 — notification Discord des commandes payées

## Ce qui fonctionne
- Route serveur `POST /api/notify-paid` pour notifier une commande **déjà marquée `paid` après vérification indépendante du paiement**.
- Authentification avec en-tête `x-admin-secret: <ADMIN_TEST_SECRET>` ; identifiant UUID dans le JSON `{"orderId":"..."}`.
- Lecture de la commande Supabase ; tentative de réservation atomique (`paid` → `notifying`) ; envoi d’un DM au destinataire `DISCORD_ADMIN_ID` (ou identifiant configuré par défaut) ; marquage `discord_notified_at`.
- Variables Vercel : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DISCORD_BOT_TOKEN`, `ADMIN_TEST_SECRET` et éventuellement `DISCORD_ADMIN_ID`.

## Limites importantes
- **Pas de surveillance blockchain automatique**. Cette route ne prouve pas qu’un paiement a été reçu. Ne marquez `paid` qu’après vérification indépendante du réseau, du montant et des confirmations.
- Avec une adresse fixe par crypto et des commandes au même prix, impossible d'attribuer sûrement chaque transfert à une commande sans mécanisme complémentaire (référence unique ou prestataire).
- Les appels concurrents sont filtrés ; néanmoins une panne entre envoi Discord et mise à jour Supabase peut laisser une notification à réconcilier manuellement.
- Ne publiez jamais `ADMIN_TEST_SECRET` ou `SUPABASE_SERVICE_ROLE_KEY` dans le navigateur, un dépôt ou un message.
- Les nouvelles commandes restent `pending` : aucune notification n'est envoyée à la création.

## Étape suivante
Choisir un service de vérification blockchain avec preuve de paiement attribuable à chaque commande et un système de rapprochement fiable, avant toute activation automatique.
