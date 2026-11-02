# Yougata Shop V30 — fiabilité du suivi

- Correction d’un risque de confusion : lors d’un changement de cryptomonnaie, l’ancienne référence de commande est immédiatement effacée. Le TXID ne peut plus être soumis à la commande précédente pendant la création de la nouvelle.
- Suivi automatique du statut toutes les 30 secondes, suspendu quand l’onglet est masqué, avec actualisation au retour.
- Rechargement du statut après création de commande et après soumission du TXID.
- Pas de SQL ni de nouvelles variables d’environnement.

**Limite :** la vérification des paiements et leur attribution restent manuelles ; la V30 n’active ni statut `paid` automatique ni DM automatique.

**Tests conseillés :** choisir LTC, puis ETH rapidement ; vérifier que l’identifiant de commande change et qu’aucun TXID n’est attribué à la commande précédente. Vérifier le suivi après une soumission de TXID fictif.
