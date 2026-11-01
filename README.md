# Boostly V2 — maquette multipage

Site statique prêt à prévisualiser sur GitHub Pages ou Vercel : `index.html`, `checkout.html`, `payment.html`, `confirm.html`, `about.html`, `style.css`.

## Mise en ligne

Décompresser le ZIP, importer les fichiers à la racine d'un dépôt GitHub, puis importer le dépôt dans Vercel (Framework Preset: Other).

## Limites importantes

Ceci est une **démonstration visuelle** : pas de paiement réel, pas de portefeuille connecté, pas de confirmation blockchain, pas de livraison automatique. Les coordonnées de commande restent dans sessionStorage du navigateur et ne sont envoyées à aucun serveur.

Pour une intégration future, utiliser un prestataire de paiement conforme et un webhook serveur signé, vérifié, idempotent, qui déclenche la notification Discord **uniquement après confirmation de paiement**. Ne jamais stocker de token de bot, secret de webhook ou clé privée dans les fichiers HTML/JS publics. Les notifications Discord nécessitent un bot autorisé, avec permissions adéquates et des MP ouverts par le destinataire.
