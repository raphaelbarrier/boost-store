(()=>{
 const btn=document.getElementById('refresh-order-status');
 const label=document.getElementById('live-order-status');
 const detail=document.getElementById('order-status-detail');
 if(!btn||!label||!detail)return;
 const names={pending:'En attente de paiement',review:'Transaction à vérifier',paid:'Paiement validé',notifying:'Paiement validé · notification en cours',cancelled:'Commande annulée',expired:'Commande expirée'};
 let busy=false, currentId='', lastStatus='';
 async function refresh(){
  const id=sessionStorage.getItem('yougataPendingOrderId');
  if(!id){label.textContent='Commande non créée';detail.textContent='Sélectionnez une cryptomonnaie pour enregistrer la commande.';return;}
  if(busy)return;busy=true;currentId=id;btn.disabled=true;
  try{
   const r=await fetch('/api/order-status?orderId='+encodeURIComponent(id),{cache:'no-store'});
   const data=await r.json();
   if(!r.ok)throw Error(data.error||'Suivi indisponible');
   if(sessionStorage.getItem('yougataPendingOrderId')!==id)return;
   lastStatus=data.status;label.textContent=names[data.status]||'En cours de vérification';
   detail.textContent=data.status==='review'?'TXID enregistré ; vérification humaine en attente.':data.status==='paid'?'Paiement enregistré comme validé.':data.status==='notifying'?'Notification Discord en cours.':data.status==='pending'?'Aucun paiement confirmé.':'Statut actualisé.';
  }catch(e){if(sessionStorage.getItem('yougataPendingOrderId')===id)detail.textContent=e.message||'Suivi indisponible.';}
  finally{busy=false;btn.disabled=false;}
 }
 btn.addEventListener('click',refresh);
 window.addEventListener('yougata:tx-submitted',refresh);
 window.addEventListener('yougata:order-created',()=>{lastStatus='';refresh()});
 window.addEventListener('yougata:order-creating',()=>{label.textContent='Création en cours';detail.textContent='Enregistrement de la commande…'});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
 // Auto-refresh at a moderate interval while the page is visible. No payment is confirmed client-side.
 setInterval(()=>{if(!document.hidden&&lastStatus!=='paid'&&lastStatus!=='cancelled'&&lastStatus!=='expired')refresh()},30000);
 setTimeout(refresh,1200);
})();
