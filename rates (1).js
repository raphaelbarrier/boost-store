// Vercel serverless endpoint: no wallet keys or credentials.
let cached=null, until=0;
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','public, s-maxage=20, stale-while-revalidate=10');
 if(cached&&Date.now()<until)return res.status(200).json(cached);
 const symbols=['BTC','ETH','LTC'];
 try{
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),7000);
  let prices;
  try{
   const r=await fetch('https://api.coinbase.com/v2/exchange-rates?currency=EUR',{signal:controller.signal,headers:{Accept:'application/json'}});
   if(!r.ok)throw new Error('Coinbase unavailable');
   const data=await r.json();prices={};
   for(const symbol of symbols){const units=Number(data?.data?.rates?.[symbol]);if(!(units>0))throw new Error('Invalid rate');prices[symbol]=1/units;}
  }finally{clearTimeout(timeout)}
  cached={prices,updatedAt:Date.now(),source:'Coinbase'};until=Date.now()+20000;
  return res.status(200).json(cached);
 }catch(e){
  try{
   const r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=eur');
   if(!r.ok)throw new Error('Fallback unavailable');const j=await r.json();
   const prices={BTC:Number(j.bitcoin?.eur),ETH:Number(j.ethereum?.eur),LTC:Number(j.litecoin?.eur)};
   if(Object.values(prices).some(x=>!(x>0)))throw new Error('Invalid fallback');
   cached={prices,updatedAt:Date.now(),source:'CoinGecko'};until=Date.now()+20000;
   return res.status(200).json(cached);
  }catch{return res.status(503).json({error:'Cours temporairement indisponibles'});}
 }
};
