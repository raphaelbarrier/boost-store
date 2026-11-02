# Yougata Shop V21 — déclaration TXID, sans validation automatique

## Supabase SQL Editor — exécuter une seule fois
```sql
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_tx_hash TEXT,
ADD COLUMN IF NOT EXISTS payment_submitted_at TIMESTAMPTZ;
CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_tx_hash_unique
ON public.orders (crypto, payment_tx_hash)
WHERE payment_tx_hash IS NOT NULL;
```

## Fonctionnement
- Après avoir choisi une crypto, le client reçoit un identifiant de commande.
- Le client peut soumettre un hash de transaction (TXID) au serveur.
- Une commande `pending` devient `review`, jamais `paid` automatiquement.
- Un TXID déjà soumis pour la même crypto est rejeté par l'index unique.
- Le système ne vérifie PAS encore la transaction, le destinataire, les confirmations, le montant ou l'expéditeur. Ne livrez pas sur la base d'une déclaration.
- Ne lancez pas de vrai paiement de test avant l'intégration d'un vérificateur blockchain fiable.

## Prochaine étape
Choisir un prestataire de paiement ou un système d'adresses uniques par commande pour attribution fiable, puis vérifier le TXID sur la bonne chaîne avec confirmations avant toute transition vers `paid` et notification Discord. Pour des adresses partagées, une vérification manuelle peut rester nécessaire.
