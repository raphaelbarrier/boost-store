# MK Shop V12 — Connexion Discord préparée

## Fonctionnel
- Le site et son mode simulation V11 sont conservés.
- `POST /api/discord-test` permet d'envoyer un **vrai DM de test** au compte Discord `1524540831183143184`, après configuration du bot. Le texte indique clairement qu'il ne s'agit pas d'un paiement.
- `api/payment-webhook.js` reste **désactivé** : aucun prestataire de paiement n'a encore été choisi/configuré. Aucun paiement réel n'est confirmé.

## Configuration Discord sur Vercel
1. Créer un bot dans Discord Developer Portal et l'inviter sur un serveur commun avec le destinataire.
2. Dans Vercel > Project > Settings > Environment Variables, ajouter `DISCORD_BOT_TOKEN` (token privé du bot) et `ADMIN_TEST_SECRET` (secret aléatoire long, distinct du token).
3. Redéployer le site.
4. Depuis un terminal administrateur, tester (remplacer le domaine et le secret) :

```bash
curl -X POST 'https://VOTRE-DOMAINE.vercel.app/api/discord-test' -H 'x-admin-secret: VOTRE_SECRET'
```

**Ne pas placer ces secrets dans les fichiers HTML/JS ni les partager.** Ne pas exposer l'endpoint de test publiquement avec le secret. Le destinataire doit autoriser les DM du bot (parfois les paramètres de confidentialité empêchent l'envoi).

## Paiements réels — reste à connecter
Le prestataire choisi devra fournir une API de facturation, un identifiant de commande, et des webhooks signés. Il faudra stocker les commandes dans une base de données persistante et vérifier la signature, le montant, la devise, le statut et les doublons côté serveur avant d'envoyer un DM de confirmation. Les comptes marchands peuvent être soumis à des conditions d'âge, d'activité et de frais minimum. Ne pas accepter de paiement réel tant que ce parcours n'est pas validé.


## V13 — Paiement type facture
Interface à deux colonnes, statut en attente, QR code d'adresse, copie et informations de commande. QR externe généré par api.qrserver.com : ne pas l'utiliser pour un paiement réel sans revue de confidentialité et sans facturation sécurisée. Les cours sont INDICATIFS, pas de montant bloqué. Aucun webhook marchand configuré, aucune confirmation de paiement réelle et aucun DM automatique. Le bouton simulation ne déclenche pas de vrai paiement. Pour activer la production, intégrer un prestataire de paiement éligible, vérifier ses webhooks signés, stocker les commandes côté serveur et envoyer un DM une seule fois après confirmation.

## V14 — Affichage de conversion et aperçu des statuts
- Après sélection de BTC/ETH/LTC, affichage du prix en euros, du cours de l'unité et de l'équivalent calculé; rafraîchissement toutes les 30 secondes via `/api/rates` sur Vercel.
- Corrige une erreur JavaScript de V13 liée à un bouton `#to-confirm` inexistant, qui pouvait empêcher la sélection de cryptomonnaie.
- Aperçu explicite des étapes de paiement **en simulation uniquement**.
- Les cours sont indicatifs et non bloqués; ils ne constituent pas une facture payable garantie. Pas de surveillance blockchain, pas de validation réelle, pas de DM automatique.
