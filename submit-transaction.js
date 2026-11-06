(()=>{
  const button=document.getElementById('submit-tx');
  const result=document.getElementById('tx-result');
  const field=document.getElementById('tx-hash');
  if(!button||!result||!field)return;
  const post=async(url,payload)=>{
    const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await response.json().catch(()=>({}));
    return {response,data};
  };
  button.addEventListener('click',async()=>{
    const orderId=sessionStorage.getItem('yougataPendingOrderId');
    const txHash=field.value.trim();
    if(!orderId){result.textContent='Créez votre commande et choisissez une cryptomonnaie avant de valider.';return;}
    if(!/^(?:0x)?[a-f0-9]{64}$/i.test(txHash)){result.textContent='TXID invalide : saisissez 64 caractères hexadécimaux (0-9, a-f).';return;}
    button.disabled=true;result.textContent='Enregistrement du TXID…';
    try{
      const saved=await post('/api/submit-transaction',{orderId,txHash});
      if(!saved.response.ok){
        // A retry is allowed for the same TXID already recorded on this order.
        const status=await fetch('/api/order-status?orderId='+encodeURIComponent(orderId)).then(r=>r.ok?r.json():null).catch(()=>null);
        const knownHash=String(status?.payment_tx_hash||'').replace(/^0x/i,'').toLowerCase();
        if(!(status?.status==='review'&&knownHash===txHash.replace(/^0x/i,'').toLowerCase())){
          result.textContent=saved.data.error||'Impossible d’enregistrer ce TXID. Vérifiez votre commande.';return;
        }
      }else{window.dispatchEvent(new Event('yougata:tx-submitted'));}
      result.textContent='TXID enregistré. Vérification sur la blockchain en cours…';
      const checked=await post('/api/notify-tx-review',{orderId});
      result.textContent=checked.data.message||checked.data.error||'Vérification indisponible. Réessayez plus tard.';
    }catch{result.textContent='Connexion indisponible. Réessayez dans quelques instants.';}
    finally{button.disabled=false;}
  });
})();
