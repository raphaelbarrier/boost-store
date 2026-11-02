(()=>{const o=JSON.parse(sessionStorage.getItem('mkShopOrder')||'null');if(!o)return;const $=id=>document.getElementById(id);const price=o.plan==='28'?'5,20 €':'2,60 €';$('offer-label').textContent=o.plan+' boosts serveur';$('sidebar-total').textContent=price;$('invoice-email').textContent=o.email;$('invoice-invite').textContent=o.invite;$('invoice-ref').textContent='Choisissez une cryptomonnaie';let qr=null;function draw(){const area=$('qr-area');area.replaceChildren();const address=$('wallet-address').textContent;if(!address)return;const img=document.createElement('img');img.alt='QR code de l’adresse de réception (sans montant garanti)';img.width=190;img.height=190;img.loading='lazy';img.src='https://api.qrserver.com/v1/create-qr-code/?size=190x190&data='+encodeURIComponent(address);img.onerror=()=>{area.textContent='QR indisponible · copiez l’adresse ci-dessous'};area.append(img);const note=document.createElement('small');note.textContent='QR code : adresse seule, sans montant bloqué';area.append(note)}let requestSequence=0;
async function createOrder(crypto){
  const seq=++requestSequence;
  sessionStorage.removeItem('yougataPendingOrderId');
  window.dispatchEvent(new Event('yougata:order-creating'));
  $('invoice-ref').textContent='Enregistrement…';
  try {
    const response=await fetch('/api/create-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:o.plan,email:o.email,invite:o.invite,discord:o.discord||'',crypto})});
    const data=await response.json();
    if(seq!==requestSequence)return;
    if(!response.ok)throw Error(data.error||'Erreur de création');
    $('invoice-ref').textContent=data.orderId;
    sessionStorage.setItem('yougataPendingOrderId',data.orderId);
    window.dispatchEvent(new Event('yougata:order-created'));
  }catch(e){if(seq===requestSequence)$('invoice-ref').textContent='Non enregistrée : '+e.message;}
}
document.querySelectorAll('[data-coin]').forEach(el=>el.addEventListener('click',()=>{draw();createOrder(({Litecoin:'LTC',Ethereum:'ETH',Bitcoin:'BTC'})[el.dataset.coin]);}));})();