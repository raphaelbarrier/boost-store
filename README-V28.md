# Yougata Shop V28 — Suivi des commandes

- Nouveau endpoint GET `/api/order-status?orderId=...` : statut Supabase en lecture seule.
- La page de paiement affiche `pending`, `review`, `paid`, `notifying`, `cancelled` ou `expired` avec des libellés français.
- Bouton d’actualisation et rafraîchissement après dépôt d’un TXID.
- Aucune clé privée exposée, aucune déclaration de TXID ne valide un paiement.
- Pas de nouveau SQL nécessaire si les migrations V20/V21 ont été faites.

## Important
Le suivi montre le statut enregistré en base. Il ne constitue pas une preuve indépendante de paiement. Les adresses crypto partagées empêchent encore une attribution automatique fiable.

## Vérification
Créer une commande de test, saisir un TXID fictif, puis actualiser : le statut doit devenir « Transaction à vérifier », jamais « Paiement validé ».
