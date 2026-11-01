# Koro Shop V3 — Démonstration

Site statique multi-pages, responsive, bleu, avec sélection de 14 ou 28 boosts et choix visuel de LTC, ETH ou BTC.

## Installation
Importer les fichiers à la racine d’un dépôt GitHub et déployer sur Vercel (Framework: Other). Ouvrir `index.html` pour tester localement.

## Important
Cette version est une démo. Aucun wallet connecté, aucune adresse de paiement configurée, aucun transfert effectué, aucune validation de paiement et aucune notification Discord. Les données de commande restent dans le sessionStorage du navigateur. Ne jamais traiter cette maquette comme un checkout réel.

## Pour mise en production
Ajouter un fournisseur de paiements crypto prenant en charge les réseaux désirés, des webhooks signés et une vérification serveur, puis un bot Discord avec token en variable d’environnement serveur uniquement. Ne jamais exposer de secrets côté navigateur.
