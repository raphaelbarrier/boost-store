// Webhook désactivé tant qu’un prestataire de paiement et ses secrets ne sont pas configurés.
module.exports=async function handler(req,res){res.setHeader("Cache-Control","no-store");return res.status(503).json({error:"Aucun prestataire de paiement configuré ; confirmations désactivées."})};
