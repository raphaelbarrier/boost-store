(()=>{
 const btn=document.getElementById('refresh-order-status');
 const label=document.getElementById('live-order-status');
 const detail=document.getElementById('order-status-detail');
 if(!btn||!label||!detail)return;
 const names={pending:'En attente de paiement',review:'Transaction à vérifier',paid:'Paiement validé',notifying:'Paiement validé · notification en cours',cancelled:'Commande annulée',expired:'Commande expirée'};
 async function refresh(){
  const id=sessionStorage.getItem('yougataPendingOrderId');
  if(!id){detail.textContent='Aucune commande créée pour cette session.';return;}
  btn.disabled=true;detail.textContent='Vérification du statut…';
  try{
   const r=await fetch('/api/order-status?orderId='+encodeURIComponent(id),{cache:'no-store'});
   const data=await r.json();
   if(!r.ok)throw Error(data.error||'Suivi indisponible');
   label.textContent=names[data.status]||'En cours de vérification';
   detail.textContent=data.status==='review'?'TXID reçu : validation manuelle en attente.':data.status==='paid'?'Paiement enregistré comme validé.':data.status==='notifying'?'Notification en cours.':data.status==='pending'?'Aucun paiement confirmé pour le moment.':'Statut actualisé.';
  }catch(e){detail.textContent=e.message||'Impossible de consulter le statut.';}finally{btn.disabled=false;}
 }
 btn.addEventListener('click',refresh);
 window.addEventListener('yougata:tx-submitted',refresh);
 setTimeout(refresh,1500);
})();
