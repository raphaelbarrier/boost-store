// Read-only blockchain lookup. Never marks orders paid or triggers Discord.
const re=/^[0-9a-f]{64}$/i;
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Méthode non autorisée'});
 const {orderId}=req.body||{};
 if(typeof orderId!=='string'||!/^[0-9a-f-]{36}$/i.test(orderId))return res.status(400).json({error:'Référence invalide'});
 const {SUPABASE_URL:url,SUPABASE_SERVICE_ROLE_KEY:key}=process.env;
 if(!url||!key)return res.status(503).json({error:'Configuration Supabase absente'});
 const h={apikey:key,Authorization:'Bearer '+key};
 try{
  const r=await fetch(url.replace(/\/$/,'')+'/rest/v1/orders?id=eq.'+encodeURIComponent(orderId)+'&select=id,crypto,payment_tx_hash,status,wallet_address',{headers:h});
  if(!r.ok)throw Error('Supabase '+r.status);
  const [o]=await r.json();
  if(!o)return res.status(404).json({error:'Commande introuvable'});
  if(!o.payment_tx_hash||!re.test(o.payment_tx_hash))return res.status(409).json({error:'Aucun TXID soumis'});
  if(o.crypto==='ETH'){
   // Blockscout public Ethereum mainnet API. Informational lookup only.
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),7000);
   let response;
   try{response=await fetch('https://eth.blockscout.com/api/v2/transactions/0x'+o.payment_tx_hash,{signal:controller.signal,headers:{Accept:'application/json'}});}finally{clearTimeout(timer)}
   if(response.status===404)return res.status(200).json({found:false,confirmed:false,status:o.status,reason:'Transaction ETH introuvable sur Ethereum mainnet'});
   if(!response.ok)return res.status(502).json({error:'Explorateur Ethereum indisponible'});
   const tx=await response.json();
   const recipient=String(tx.to?.hash||tx.to?.address||'').toLowerCase();
   const matches=recipient===String(o.wallet_address||'').toLowerCase();
   const amountWei=BigInt(String(tx.value||'0'));
   const received=matches?Number(amountWei)/1e18:0;
   const success=tx.status==='ok';
   return res.status(200).json({found:true,confirmations:Number(tx.confirmations||0),receivedCrypto:received,recipientMatches:matches,network:'Ethereum mainnet',transactionSuccessful:success,status:o.status,confirmed:false,reason:'Lecture seule : les paiements ERC-20 et contrats ne sont pas couverts. Montant, taux, unicité et attribution de commande non validés.'});
  }
  if(!['BTC','LTC'].includes(o.crypto))return res.status(400).json({error:'Réseau non pris en charge'});
  // BlockCypher public API; informational only, cannot attribute a shared-address transfer to an order.
  const network=o.crypto==='BTC'?'btc/main':'ltc/main';
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),7000);
  let response;
  try{response=await fetch('https://api.blockcypher.com/v1/'+network+'/txs/'+o.payment_tx_hash,{signal:controller.signal});}finally{clearTimeout(timer)}
  if(response.status===404)return res.status(200).json({found:false,confirmed:false,status:o.status,reason:'Transaction introuvable sur le réseau sélectionné'});
  if(!response.ok)return res.status(502).json({error:'Explorateur indisponible'});
  const tx=await response.json();
  const received=(tx.outputs||[]).filter(x=>(x.addresses||[]).includes(o.wallet_address)).reduce((sum,x)=>sum+Number(x.value||0),0);
  return res.status(200).json({found:true,confirmations:Number(tx.confirmations||0),receivedCrypto:received/1e8,recipientMatches:received>0,status:o.status,confirmed:false,reason:'Consultation informative : montant, taux, unicité et attribution non vérifiés. Validation manuelle requise.'});
 }catch(e){console.error('check transaction',e.message);return res.status(502).json({error:'Vérification momentanément indisponible'});}
};
