// Offline test: no blockchain, Supabase, or Discord requests are made.
const assert = require('node:assert/strict');
const handler = require('./api/notify-paid');
const id = 'b67cf03d-4f88-4a7e-bf04-907a6c340695';
process.env.SUPABASE_URL='https://mock.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY='mock-key';
process.env.DISCORD_BOT_TOKEN='mock-bot';
process.env.ADMIN_TEST_SECRET='mock-secret';
process.env.DISCORD_ADMIN_ID='1524540831183143184';
function response(){return {statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(x){this.body=x;return this}}}
function mockReply(data,status=200){return {ok:status>=200&&status<300,status,json:async()=>data}}
async function run(){
 let calls=[], order={id,product:'14_boosts',price_eur:2.6,crypto:'LTC',discord_invite:'https://discord.gg/example',status:'paid',discord_notified_at:null};
 global.fetch=async (url,opts)=>{
  calls.push({url,opts});
  if(url.includes('/rest/v1/orders')){
   const patch=JSON.parse(opts.body);
   if(url.includes('status=eq.paid')){if(order.status!=='paid'||order.discord_notified_at)return mockReply([]);order={...order,...patch};return mockReply([order])}
   if(url.includes('status=eq.notifying')){if(order.status!=='notifying')return mockReply([]);order={...order,...patch};return mockReply([order])}
  }
  if(url.endsWith('/users/@me/channels'))return mockReply({id:'mock-channel'});
  if(url.includes('/messages'))return mockReply({id:'mock-message'});
  throw Error('Unexpected request '+url);
 };
 const invoke=async(secret='mock-secret')=>{let res=response();await handler({method:'POST',headers:{'x-admin-secret':secret},body:{orderId:id}},res);return res};
 assert.equal((await invoke('wrong')).statusCode,401);
 assert.equal(calls.length,0);
 const success=await invoke();assert.equal(success.statusCode,200);assert.equal(order.status,'paid');assert.ok(order.discord_notified_at);
 assert.equal(calls.filter(c=>c.url.includes('/messages')).length,1);
 const duplicate=await invoke();assert.equal(duplicate.statusCode,409);assert.equal(calls.filter(c=>c.url.includes('/messages')).length,1);
 console.log('OK: secret rejeté, DM simulé une fois, deuxième tentative bloquée. Aucun vrai message envoyé.');
}
run().catch(e=>{console.error(e);process.exitCode=1});
