export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const {paymentId, txid} = req.body || {};
  if(!paymentId || !txid) return res.status(400).json({error:'no paymentId or txid'});
  try{
    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`,{
      method:'POST',
      headers:{
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({txid})
    });
    const data = await piRes.json();
    console.log('COMPLETE RES', piRes.status, data);
    if(!piRes.ok) return res.status(500).json({error:'pi complete failed', detail:data});
    return res.status(200).json({ok:true, data});
  }catch(e){
    console.error('COMPLETE ERROR', e);
    return res.status(500).json({error:e.message});
  }
}
