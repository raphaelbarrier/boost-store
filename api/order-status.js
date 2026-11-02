// Read-only customer status: only non-sensitive fields are exposed.
module.exports = async (req,res) => {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET')return res.status(405).json({error:'Méthode non autorisée'});
 const id=req.query?.orderId;
 if(typeof id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))return res.status(400).json({error:'Référence invalide'});
 const {SUPABASE_URL:url,SUPABASE_SERVICE_ROLE_KEY:key}=process.env;
 if(!url||!key)return res.status(503).json({error:'Configuration indisponible'});
 try {
  const endpoint=url.replace(/\/$/,'')+'/rest/v1/orders?id=eq.'+encodeURIComponent(id)+'&select=id,status,crypto,payment_submitted_at,payment_confirmed_at,discord_notified_at&limit=1';
  const r=await fetch(endpoint,{headers:{apikey:key,Authorization:'Bearer '+key},signal:AbortSignal.timeout(7000)});
  if(!r.ok)throw Error('Database '+r.status);
  const rows=await r.json();
  if(!rows.length)return res.status(404).json({error:'Commande introuvable'});
  const o=rows[0];
  const allowed=['pending','review','paid','notifying','cancelled','expired'];
  return res.status(200).json({orderId:o.id,status:allowed.includes(o.status)?o.status:'review',crypto:o.crypto,submitted:!!o.payment_submitted_at,confirmed:!!o.payment_confirmed_at,notified:!!o.discord_notified_at});
 }catch(e){console.error('Order status unavailable',e.message);return res.status(502).json({error:'Suivi temporairement indisponible'});}
};
