export default async function handler(req, res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  try{
    let body = req.body;
    if(typeof body === 'string') body = JSON.parse(body);
    const paymentId = body.paymentId || body.payment_id;
    if(!paymentId) return res.status(400).json({error:'no paymentId'});
    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method:'POST',
      headers:{'Authorization':`Key ${process.env.PI_API_KEY}`,'Content-Type':'application/json'}
    });
    const data = await piRes.json();
    console.log('APPROVE RES', data);
    return res.status(200).json(data);
  }catch(e){
    console.error(e);
    return res.status(500).json({error:e.message});
  }
}
