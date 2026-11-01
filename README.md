# MK Shop V11 — Prototype de notifications

## Ce qui fonctionne
- Site V10 conservé : offres, formulaire d’invitation, choix crypto, affichage indicatif des cours via `/api/rates`.
- **Mode test** sur `payment.html` : sélectionner une crypto, cliquer sur « Simuler un paiement confirmé », puis consulter l’aperçu de DM staff.
- Le test est **local au navigateur** (sessionStorage) : aucun transfert d’argent, aucune confirmation blockchain et **aucun vrai DM Discord**.

## Préparation de l’intégration future
- `/api/payment-webhook.js` est un endpoint **volontairement désactivé** (HTTP 503).
- Destinataire staff envisagé : `1524540831183143184`.
- Pour activer : prestataire autorisé pour le marchand et le produit, création de factures uniques côté serveur, base de données de commandes, validation cryptographique du webhook, vérification du montant et de la devise, protection contre les doublons, puis envoi d’un DM via bot Discord avec token stocké dans les variables d’environnement Vercel.
- Ne jamais mettre un token Discord, une clé API secrète ou une clé privée crypto dans les fichiers front-end.
- Les prix crypto de `/api/rates` ne sont pas des factures et ne garantissent aucun taux.

## Installation
Téléverser **tous** les fichiers et le dossier `api` sur GitHub, puis déployer sur Vercel. Aucune variable secrète n’est nécessaire pour la simulation.
