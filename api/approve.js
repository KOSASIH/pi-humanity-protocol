export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).json({error: 'paymentId required'});

  const PI_API_KEY = process.env.PI_API_KEY;
  if (!PI_API_KEY) {
    console.error('PI_API_KEY MISSING');
    return res.status(500).json({error: 'Server API Key not set'});
  }

  try {
    console.log('Approving:', paymentId);
    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await piRes.json();
    console.log('PI APPROVE RES:', piRes.status, JSON.stringify(data));

    if (!piRes.ok) {
      return res.status(piRes.status).json(data);
    }

    return res.status(200).json({success: true, data});
  } catch (e) {
    console.error('APPROVE ERROR:', e);
    return res.status(500).json({error: e.message});
  }
}
