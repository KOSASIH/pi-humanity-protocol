export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const secret = process.env.APP_WALLET_SECRET;
    if (!secret) return res.status(500).json({ error: "APP_WALLET_SECRET belum di set" });

    // Load Stellar SDK dari CDN biar gak usah install
    const StellarSdk = (await import('https://esm.sh/stellar-sdk@11.4.0')).default;

    const FOUNDER = "GCKUNNC6X6LKYJXKTQEJAQQ2J6NTIHMRNJFM2KY6KIBB46BOPMKVXDQN";
    const server = new StellarSdk.Server("https://api.testnet.minepi.com");
    const source = StellarSdk.Keypair.fromSecret(secret.trim());
    const account = await server.loadAccount(source.publicKey());

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: "Pi Testnet"
    })
    .addOperation(StellarSdk.Operation.payment({
      destination: FOUNDER,
      asset: StellarSdk.Asset.native(),
      amount: "0.09"
    }))
    .setTimeout(30)
    .build();

    tx.sign(source);
    const result = await server.submitTransaction(tx);
    return res.json({ success: true, hash: result.hash, from: source.publicKey(), to: FOUNDER });

  } catch (e) {
    console.error("PAYOUT ERROR:", e);
    return res.status(500).json({ error: e.message, detail: e.response?.data || null });
  }
}
