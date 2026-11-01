// Integration placeholder, intentionally disabled. Never trust a browser-side "paid" flag.
// Configure a provider-specific signature verification, order lookup, amount/currency
// verification, replay protection, and database persistence before enabling.
module.exports=async function handler(req,res){res.setHeader('Cache-Control','no-store');res.status(503).json({error:'Paiements réels non configurés. Webhook désactivé.'});};
