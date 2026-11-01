// Server-only Discord DM test. Requires an administrator secret and bot token.
// This endpoint never accepts a payment status from the browser.
const crypto = require('crypto');
const STAFF_ID = '1524540831183143184';
function equal(a,b){const x=Buffer.from(String(a||'')),y=Buffer.from(String(b||''));return x.length===y.length&&crypto.timingSafeEqual(x,y)}
module.exports = async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Méthode non autorisée'});
  if(!process.env.DISCORD_BOT_TOKEN||!process.env.ADMIN_TEST_SECRET)return res.status(503).json({error:'Configurer DISCORD_BOT_TOKEN et ADMIN_TEST_SECRET sur Vercel.'});
  if(!equal(req.headers['x-admin-secret'],process.env.ADMIN_TEST_SECRET))return res.status(401).json({error:'Non autorisé'});
  try{
    const headers={Authorization:`Bot ${process.env.DISCORD_BOT_TOKEN}`,'Content-Type':'application/json'};
    const channelResp=await fetch('https://discord.com/api/v10/users/@me/channels',{method:'POST',headers,body:JSON.stringify({recipient_id:STAFF_ID})});
    if(!channelResp.ok)throw new Error(`Ouverture DM refusée (${channelResp.status})`);
    const channel=await channelResp.json();
    const sendResp=await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages`,{method:'POST',headers,body:JSON.stringify({content:'🧪 **MK Shop — Test de notification**\nCe message vérifie uniquement la connexion du bot Discord. **Aucun paiement n’a été reçu ni confirmé.**',allowed_mentions:{parse:[]}})});
    if(!sendResp.ok)throw new Error(`Envoi DM refusé (${sendResp.status})`);
    return res.status(200).json({ok:true,message:'DM de test envoyé.'});
  }catch(e){return res.status(502).json({error:e.message})}
};
