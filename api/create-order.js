// Server-only Supabase order creation. Never accepts a paid status from clients.
const ADDRESS = {
  BTC: 'bc1qn7km3lptc2vvnr5y9kawsa4lmzeukfmdfr0cvt',
  ETH: '0x3E2E4a3309d14e5416eE5e76b91CA2f3dbDffA10',
  LTC: 'LNQhbTH7cNHDGuWmrK6FNVKBEUvnR7XpNB'
};
const ALLOWED_ORIGIN = process.env.SHOP_ORIGIN || 'https://boost-store-ten.vercel.app';
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({error:'Méthode non autorisée'});
  const origin = req.headers.origin;
  if (origin && origin !== ALLOWED_ORIGIN) return res.status(403).json({error:'Origine non autorisée'});
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({error:'Base de données non configurée'});
  const {plan,email,invite,discord,crypto} = req.body || {};
  const normalizedPlan = typeof plan === 'string' || typeof plan === 'number' ? String(plan).trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';
  const normalizedInvite = typeof invite === 'string' ? invite.trim() : '';
  const normalizedDiscord = typeof discord === 'string' ? discord.trim() : '';
  const normalizedCrypto = typeof crypto === 'string' ? crypto.trim().toUpperCase() : '';
  const invalid = [];
  if (!['14','28'].includes(normalizedPlan)) invalid.push('plan');
  if (!Object.hasOwn(ADDRESS, normalizedCrypto)) invalid.push('crypto');
  if (!normalizedEmail || normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) invalid.push('email');
  if (!normalizedInvite || normalizedInvite.length > 200 || !/^https:\/\/(?:www\.)?(?:discord\.gg|discord\.com\/invite)\/[A-Za-z0-9-]+\/?$/.test(normalizedInvite)) invalid.push('invite');
  if (discord != null && (typeof discord !== 'string' || normalizedDiscord.length > 100)) invalid.push('discord');
  if (invalid.length) return res.status(400).json({error:'Informations de commande invalides',fields:invalid});
  const record = {
    product: normalizedPlan === '14' ? '14_boosts' : '28_boosts',
    price_eur: normalizedPlan === '14' ? 2.60 : 5.20,
    email: normalizedEmail,
    discord_invite: normalizedInvite,
    crypto: normalizedCrypto,
    wallet_address: ADDRESS[normalizedCrypto],
    status: 'pending'
  };
  // The supplied schema does not contain a Discord username field, so it is not persisted.
  try {
    const response = await fetch(url.replace(/\/$/,'')+'/rest/v1/orders', {
      method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=representation'},
      body:JSON.stringify(record)
    });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data) || !data[0]?.id) {
      console.error('Supabase insert failed',response.status,JSON.stringify(data).slice(0,400));
      return res.status(502).json({error:'Enregistrement de commande impossible'});
    }
    return res.status(201).json({orderId:data[0].id,status:'pending',priceEur:record.price_eur,crypto:normalizedCrypto,walletAddress:ADDRESS[normalizedCrypto]});
  } catch(e) { console.error('Supabase request failed',e.message);return res.status(502).json({error:'Service temporairement indisponible'}); }
};
