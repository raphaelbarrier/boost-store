# Yougata Shop V29 — consultation blockchain BTC / LTC / ETH

- Vérification **en lecture seule** des transactions Ethereum mainnet (ETH natif) via Blockscout, en complément de BTC et LTC via BlockCypher.
- Le résultat affiche si le destinataire correspond à l’adresse de la boutique. Une transaction trouvée à une autre adresse n’est pas présentée comme un versement reçu.
- Aucune commande ne passe automatiquement à `paid`. Aucun DM Discord n’est envoyé sur la base de cette consultation.
- Pas de nouveau SQL nécessaire si les migrations précédentes sont installées.

## Limites importantes
- Les adresses crypto sont partagées entre clients : un TXID soumis peut appartenir à un autre acheteur. L'attribution automatique reste impossible sans dispositif fiable (adresse unique par commande ou prestataire de paiement).
- L'API Ethereum ne suit que les transferts natifs directs, pas les ERC-20 ou les transactions via contrats.
- Les API publiques ont des limites de débit et peuvent être indisponibles. Vérifier en production avant de s'y fier.
- Ne pas accepter de commandes réelles sans procédure de vérification humaine.

## Vérification manuelle
1. Déployer les fichiers sur Vercel.
2. Créer une commande test et renseigner un TXID Ethereum mainnet public.
3. Cliquer sur « Consulter la transaction sur la blockchain » : le résultat reste informatif et le statut ne doit jamais passer à `paid`.
4. Tester un TXID vers une autre adresse : le site doit signaler la non-correspondance.
