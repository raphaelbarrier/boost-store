# Yougata Shop V22 — vérification informative et tests

## Ce qui fonctionne
- Déclaration TXID et passage en `review` (V21).
- Consultation publique des TXID BTC et LTC via BlockCypher, depuis `/api/check-transaction`.
- Affichage du nombre de confirmations et du montant reçu à l’adresse.
- Aucun passage automatique en `paid`, aucune notification Discord déclenchée par une déclaration ou une consultation.

## Limites critiques
- ETH n’est pas encore relié à un explorateur; le bouton indique explicitement l’absence de vérification.
- Une transaction vers une adresse partagée ne prouve pas quelle commande elle règle.
- Aucun montant crypto contractuel n’est fixé lors de la commande; il est impossible de valider automatiquement le prix en EUR.
- Une transaction peut avoir plusieurs sorties, et la consultation ne constitue pas une validation de paiement.
- Le endpoint de consultation est public : limiter les appels et protéger l’accès avant production à grande échelle.

## Déploiement
1. Décompresser le ZIP et remplacer les fichiers sur GitHub.
2. Vérifier les variables Vercel `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` (ne jamais les publier).
3. Déployer, créer une commande test, soumettre un TXID factice : le statut doit être `review`, pas `paid`.
4. Utiliser le bouton « Consulter la transaction » : un faux TXID doit être introuvable.
5. Aucun paiement réel n’est nécessaire pour ce test.

## Pour activer le paiement automatique plus tard
Un prestataire avec facture et webhook signé, ou des adresses uniques par commande, et un taux verrouillé côté serveur sont requis. Ne pas activer l’expédition automatique sur la seule base du TXID.
