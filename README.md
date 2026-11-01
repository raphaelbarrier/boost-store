# MK Shop V7

Site statique multipage prêt à déployer sur GitHub + Vercel.

- Identité MK Shop sur toutes les pages
- Logo rose fourni par le client (boost-logo.png, fond rendu transparent)
- Fond bleu nuit, neige légère, cartes interactives
- Offres 14 boosts / 1,40 € et 28 boosts / 2,80 €

**Important :** le site est une interface de présentation. Les paiements crypto et notifications Discord ne sont pas actifs. Ne pas considérer une commande comme payée sans vérification serveur.

Déployer les fichiers à la racine du dépôt GitHub puis importer le dépôt sur Vercel (Framework Preset: Other).

Optimisations V7 : icônes de boost plus petites, cartes compactes, meilleur affichage mobile, focus clavier visible et neige allégée.

- Titres des offres alignés horizontalement avec leurs logos.
- Champ obligatoire pour le lien d’invitation Discord, vérifié côté navigateur et inclus au récapitulatif.


V8 : adresses publiques LTC, BTC et ETH affichées selon la crypto sélectionnée sur payment.html, bouton de copie. Aucun montant en crypto, paiement confirmé, bot Discord ou suivi blockchain automatique : nécessite une intégration serveur sécurisée. Vérifier la propriété des adresses et le réseau avant publication.


## V9 — Conversion crypto indicative
La page payment.html interroge l’API publique CoinGecko pour convertir 1,40 € ou 2,80 € en BTC, ETH ou LTC et rafraîchit le taux toutes les 30 secondes. Si l’API échoue ou le cours est trop ancien, aucun montant n’est présenté. Les montants ne sont pas verrouillés, les frais réseau sont exclus, et le site ne vérifie **aucun paiement**. Ne pas accepter de commandes réelles avant intégration serveur d’un prestataire de paiement et confirmation on-chain.
