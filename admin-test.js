'use strict';
const form = document.getElementById('discord-test-form');
const secretInput = document.getElementById('admin-secret');
const result = document.getElementById('test-result');
const submit = document.getElementById('send-test');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const secret = secretInput.value;
  secretInput.value = '';
  if (!secret.trim()) { result.textContent = 'Saisis ton secret administrateur.'; return; }
  submit.disabled = true;
  submit.textContent = 'Envoi en cours…';
  result.textContent = 'Connexion sécurisée à Discord en cours…';
  try {
    const response = await fetch('/api/discord-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({}),
      cache: 'no-store',
      credentials: 'same-origin'
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok && payload.ok) {
      result.textContent = '✅ ' + (payload.message || 'DM de test envoyé. Vérifie Discord.');
    } else {
      const message = typeof payload.error === 'string' ? payload.error : 'Erreur inconnue.';
      result.textContent = `❌ Échec (HTTP ${response.status}) : ${message}`;
    }
  } catch (_) {
    result.textContent = '❌ Impossible de joindre le serveur. Vérifie la connexion et le déploiement Vercel.';
  } finally {
    submit.disabled = false;
    submit.textContent = 'Envoyer un DM de test';
  }
});
