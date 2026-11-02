# Test hors ligne des notifications V20

Lancer `node test-notify-paid.js` pour tester la route `api/notify-paid.js` sans contacter Supabase ni Discord. Le test contrôle l'authentification, un envoi simulé unique, et le blocage d'un second envoi.

## Avant tout essai réel

Dans Supabase SQL Editor, exécuter :

```sql
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS discord_notified_at TIMESTAMPTZ;
```

La route nécessite aussi les variables serveur `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DISCORD_BOT_TOKEN`, `ADMIN_TEST_SECRET`, `DISCORD_ADMIN_ID`. Ne jamais publier leurs valeurs.

Ne pas mettre une vraie commande au statut `paid` pour tester : cette route suppose que le paiement a déjà été vérifié indépendamment. Un test hors ligne ne prouve pas que la route fonctionne sur le Vercel déployé.

Le suivi blockchain automatique n'est pas activé. Les adresses fixes partagées ne suffisent pas à attribuer avec certitude chaque paiement à une commande.
