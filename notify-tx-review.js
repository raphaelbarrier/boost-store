// Internal endpoint: sends a staff DM only after an on-chain lookup.
// It does NOT mark the order paid; shared deposit addresses need attribution review.
const crypto = require('crypto');
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const txre = /^[0-9a-f]{64}$/i;
const wallets = {BTC:'bc1qn7km3lptc2vvnr5y9kawsa4lmzeukfmdfr0cvt',ETH:'0x3E2E4a3309d14e5416eE5e76b91CA2f3dbDffA10',LTC:'LNQhbTH7cNHDGuWmrK6FNVKBEUvnR7XpNB'};
const headers = key => ({apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=representation'});
const fetchJSON = async (url,opts={}) => {const r=await fetch(url,{...opts,signal:AbortSignal.timeout(9000)});if(!r.ok)throw new Error('Service HTTP '+r.status);return r.json()};
module.exports = async (req,res) => {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Méthode non autorisée'});
 const {SUPABASE_URL:url,SUPABASE_SERVICE_ROLE_KEY:key,DISCORD_BOT_TOKEN:token,DISCORD_ADMIN_ID:staff}=process.env;
 if(!url||!key||!token||!staff)return res.status(503).json({error:'Configuration serveur manquante'});
 const id=req.body?.orderId;
 if(typeof id!=='string'||!uuid.test(id))return res.status(400).json({error:'Référence invalide'});
 const base=url.replace(/\/$/,'')+'/rest/v1/orders';
 try {
  const orders=await fetchJSON(base+'?id=eq.'+encodeURIComponent(id)+'&select=*',{headers:headers(key)});
  const o=orders[0];
  if(!o||o.status!=='review'||!txre.test(o.payment_tx_hash||''))return res.status(409).json({error:'Aucun TXID en cours de vérification'});
  if(!wallets[o.crypto])return res.status(400).json({error:'Crypto non prise en charge'});
  let confirmations=0,received=0;
  if(o.crypto==='ETH'){
   const tx=await fetchJSON('https://eth.blockscout.com/api/v2/transactions/0x'+o.payment_tx_hash);
   if(tx.status!=='ok'||String(tx.to?.hash||tx.to?.address||'').toLowerCase()!==wallets.ETH.toLowerCase())return res.status(202).json({ok:true,verified:false,message:'Transaction non confirmée ou destinataire incorrect'});
   confirmations=Number(tx.confirmations||0);received=Number(BigInt(String(tx.value||'0')))/1e18;
  }else{
   const chain=o.crypto==='BTC'?'btc/main':'ltc/main';
   const tx=await fetchJSON('https://api.blockcypher.com/v1/'+chain+'/txs/'+o.payment_tx_hash);
   confirmations=Number(tx.confirmations||0);
   received=(tx.outputs||[]).filter(x=>(x.addresses||[]).includes(wallets[o.crypto])).reduce((n,x)=>n+Number(x.value||0),0)/1e8;
  }
  if(confirmations<2||received<=0)return res.status(202).json({ok:true,verified:false,message:'En attente de confirmations blockchain'});
  // Claim once via atomic conditional update. Dedicated column required by migration.
  const claim=await fetchJSON(base+'?id=eq.'+encodeURIComponent(id)+'&status=eq.review&tx_review_notified_at=is.null',{method:'PATCH',headers:headers(key),body:JSON.stringify({tx_review_notified_at:new Date().toISOString()})});
  if(!claim.length)return res.status(200).json({ok:true,verified:true,message:'Transaction déjà transmise pour vérification'});
  const auth={Authorization:'Bot '+token,'Content-Type':'application/json'};
  const channel=await fetchJSON('https://discord.com/api/v10/users/@me/channels',{method:'POST',headers:auth,body:JSON.stringify({recipient_id:staff})});
  const content=['🔎 **Yougata — TXID détecté sur la blockchain**','⚠️ **Attribution à la commande NON confirmée : ne pas livrer automatiquement.**','Commande : `'+o.id+'`','Offre : '+String(o.product||'inconnue').slice(0,80),'Prix : '+String(o.price_eur||'?')+' €','Crypto : '+o.crypto,'TXID : `'+o.payment_tx_hash+'`','Reçu à l’adresse de la boutique : '+received+' '+o.crypto,'Confirmations : '+confirmations,'Invitation : '+String(o.discord_invite||'non renseignée').slice(0,180)].join('\n');
  await fetchJSON('https://discord.com/api/v10/channels/'+encodeURIComponent(channel.id)+'/messages',{method:'POST',headers:auth,body:JSON.stringify({content,allowed_mentions:{parse:[]}})});
  return res.status(200).json({ok:true,verified:true,message:'Transaction détectée et transmise au bot pour vérification'});
 }catch(e){console.error('tx review:',e.message);return res.status(502).json({error:'Vérification temporairement indisponible. Réessayez plus tard.'})}
};
