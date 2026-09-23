export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const paymentId = body?.paymentId;
    const txid = body?.txid;
    if (!paymentId || !txid) return res.status(400).json({error:'paymentId & txid required'});
    const PI_API_KEY = process.env.PI_API_KEY;
    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: { 'Authorization': `Key ${PI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ txid })
    });
    const data = await piRes.json();
    console.log('PI COMPLETE RES:', piRes.status, JSON.stringify(data));
    if (!piRes.ok) return res.status(piRes.status).json(data);
    return res.json({success:true, founder:"GCKU...XDQN", data});
  } catch (e) { return res.status(500).json({error:e.message}); }
}
