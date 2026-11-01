# MK Shop V10 — correctif des cours

## Déploiement
Importer **tous** les fichiers et le dossier `api/` à la racine du dépôt GitHub, puis déployer sur Vercel avec Framework Preset = Other. Ne pas ouvrir `payment.html` localement : la route `/api/rates` exige un déploiement Vercel.

## Test
Visiter `https://VOTRE-DOMAINE.vercel.app/api/rates` : la réponse doit contenir `prices.BTC`, `prices.ETH` et `prices.LTC` (valeurs en euros pour une unité de crypto). Puis tester la page de paiement.

## Limites
Les cours sont indicatifs, recalculés régulièrement et non bloqués. Aucun paiement n'est vérifié. Les frais de réseau ne sont pas inclus. Ne pas traiter une commande comme payée sans vérification indépendante. Ne jamais mettre de secrets dans le code public.
