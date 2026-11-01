# Boostly — vitrine Discord boosts

Site statique responsive. Ouvrez `index.html` ou déployez sur GitHub Pages / Vercel.

## État actuel
- Deux offres : 14 boosts à 1,40 € et 28 boosts à 2,80 €.
- Sélecteur BTC / ETH / LTC.
- Aucun paiement réel activé. Aucune transaction ni notification Discord n'est simulée comme payée.

## Pour activer de vrais paiements
1. Configurer les adresses publiques BTC, ETH et LTC côté serveur (jamais les clés privées).
2. Utiliser un prestataire de paiement crypto compatible avec les trois réseaux, disposant d'une API et de webhooks signés. Vérifier les conditions d'âge et de service.
3. Créer des commandes côté serveur avec montant crypto exact, expiration et identifiant unique.
4. Vérifier les signatures des webhooks et la confirmation blockchain; prévenir les doubles notifications et transactions réutilisées.
5. Utiliser un bot Discord côté serveur (jeton dans une variable d'environnement) pour envoyer un DM à l'ID utilisateur 1524540831183143184. Un DM peut échouer selon les paramètres de confidentialité.
6. Ne livrer qu'après paiement vérifié et s'assurer que la fourniture des boosts respecte les règles Discord.
