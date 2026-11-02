// Customer-provided transaction hash is evidence for review, NEVER proof of payment.
module.exports = async (req,res) => {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Méthode non autorisée'});
  const {SUPABASE_URL:url,SUPABASE_SERVICE_ROLE_KEY:key}=process.env;
  if(!url||!key)return res.status(503).json({error:'Configuration manquante'});
  const {orderId,txHash}=req.body||{};
  if(typeof orderId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId))return res.status(400).json({error:'Référence invalide'});
  if(typeof txHash!=='string'||! /^(?:0x)?[a-f0-9]{64}$/i.test(txHash))return res.status(400).json({error:'Hash de transaction invalide'});
  const hash=txHash.toLowerCase().replace(/^0x/,'');
  const base=url.replace(/\/$/,'')+'/rest/v1/orders';
  const headers={apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=representation'};
  try{
    const path=base+'?id=eq.'+encodeURIComponent(orderId)+'&status=eq.pending&payment_tx_hash=is.null';
    const response=await fetch(path,{method:'PATCH',headers,body:JSON.stringify({payment_tx_hash:hash,payment_submitted_at:new Date().toISOString(),status:'review'})});
    if(!response.ok)throw Error('Mise à jour impossible');
    const data=await response.json();
    if(!data.length)return res.status(409).json({error:'Commande déjà soumise ou introuvable'});
    return res.status(202).json({ok:true,status:'review',message:'Transaction reçue, vérification en attente. Aucun paiement confirmé.'});
  }catch(e){console.error('Transaction submission:',e.message);return res.status(502).json({error:'Service temporairement indisponible'});}
};
