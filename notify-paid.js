// ADMIN ONLY. Sends a single DM for an order ALREADY verified and marked paid.
// Does not verify blockchain transactions. Never expose the service role key.
const crypto = require('crypto');
const STAFF_ID = process.env.DISCORD_ADMIN_ID || '1524540831183143184';
function equal(a,b){const x=Buffer.from(String(a||''));const y=Buffer.from(String(b||''));return x.length===y.length&&crypto.timingSafeEqual(x,y)}
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Méthode non autorisée'});
 const {SUPABASE_URL:url,SUPABASE_SERVICE_ROLE_KEY:key,DISCORD_BOT_TOKEN:token,ADMIN_TEST_SECRET:secret}=process.env;
 if(!url||!key||!token||!secret)return res.status(503).json({error:'Configuration serveur incomplète'});
 if(!equal(req.headers['x-admin-secret'],secret))return res.status(401).json({error:'Non autorisé'});
 const id=req.body?.orderId;
 if(typeof id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))return res.status(400).json({error:'Identifiant invalide'});
 const base=url.replace(/\/$/,'')+'/rest/v1/orders';
 const h={apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=representation'};
 const path=base+'?id=eq.'+encodeURIComponent(id);
 try{
  // Claim only paid, unnotified orders; concurrent calls cannot both claim.
  const claim=await fetch(path+'&status=eq.paid&discord_notified_at=is.null',{method:'PATCH',headers:h,body:JSON.stringify({status:'notifying'})});
  if(!claim.ok)throw Error('Impossible de réserver la notification');
  const rows=await claim.json();
  if(!rows.length)return res.status(409).json({error:'Commande non payée, déjà notifiée ou en cours de traitement'});
  const order=rows[0];
  try{
   const dh={Authorization:'Bot '+token,'Content-Type':'application/json'};
   const opened=await fetch('https://discord.com/api/v10/users/@me/channels',{method:'POST',headers:dh,body:JSON.stringify({recipient_id:STAFF_ID})});
   if(!opened.ok)throw Error('Discord: ouverture du DM impossible ('+opened.status+')');
   const channel=await opened.json();
   const content=['✅ **Yougata Shop — Paiement vérifié**','Commande : `'+order.id+'`','Offre : '+(order.product==='28_boosts'?'28 boosts':'14 boosts'),'Montant : '+Number(order.price_eur).toFixed(2)+' €','Crypto : '+order.crypto,'Invitation : '+(order.discord_invite||'non renseignée')].join('\n');
   const sent=await fetch('https://discord.com/api/v10/channels/'+channel.id+'/messages',{method:'POST',headers:dh,body:JSON.stringify({content,allowed_mentions:{parse:[]}})});
   if(!sent.ok)throw Error('Discord: envoi refusé ('+sent.status+')');
   const finish=await fetch(path+'&status=eq.notifying',{method:'PATCH',headers:h,body:JSON.stringify({status:'paid',discord_notified_at:new Date().toISOString()})});
   if(!finish.ok)throw Error('DM envoyé mais enregistrement du suivi échoué : intervention nécessaire');
   return res.status(200).json({ok:true,message:'Notification envoyée'});
  }catch(e){
   // If Discord send succeeded but DB update failed, retry may duplicate: warn operator.
   if(!e.message.includes('suivi échoué'))await fetch(path+'&status=eq.notifying',{method:'PATCH',headers:h,body:JSON.stringify({status:'paid'})}).catch(()=>{});
   console.error('Notification failed:',e.message);
   return res.status(502).json({error:e.message});
  }
 }catch(e){console.error('Claim failed:',e.message);return res.status(502).json({error:'Service indisponible'});}
};
