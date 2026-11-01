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
