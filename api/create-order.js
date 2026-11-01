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
  if (!['14','28'].includes(plan) || !Object.hasOwn(ADDRESS,crypto) ||
      typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof invite !== 'string' || invite.length > 200 || !/^https:\/\/(?:www\.)?(?:discord\.gg|discord\.com\/invite)\/[A-Za-z0-9-]+\/?$/.test(invite) ||
      (discord != null && (typeof discord !== 'string' || discord.length > 100))) {
    return res.status(400).json({error:'Informations de commande invalides'});
  }
  const record = {product: plan === '14' ? '14_boosts' : '28_boosts', price_eur:plan === '14'?2.60:5.20,
    email:email.trim(), discord_invite:invite.trim(), crypto, wallet_address:ADDRESS[crypto], status:'pending'};
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
    return res.status(201).json({orderId:data[0].id,status:'pending',priceEur:record.price_eur,crypto,walletAddress:ADDRESS[crypto]});
  } catch(e) { console.error('Supabase request failed',e.message);return res.status(502).json({error:'Service temporairement indisponible'}); }
};
