export default async function handler(req, res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  try{
    let body = req.body;
    if(typeof body === 'string') body = JSON.parse(body);
    const {paymentId, txid} = body;
    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method:'POST',
      headers:{'Authorization':`Key ${process.env.PI_API_KEY}`,'Content-Type':'application/json'},
      body: JSON.stringify({txid})
    });
    const data = await piRes.json();
    console.log('COMPLETE RES', data);
    return res.status(200).json(data);
  }catch(e){
    return res.status(500).json({error:e.message});
  }
}
