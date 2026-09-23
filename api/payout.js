import { Keypair, Server, Asset, Operation, TransactionBuilder, BASE_FEE } from 'stellar-sdk';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    const APP_SECRET = process.env.APP_WALLET_SECRET; // Private key dari GDYY6...
    const FOUNDER = "GCKUNNC6X6LKYJXKTQEJAQQ2J6NTIHMRNJFM2KY6KIBB46BOPMKVXDQN";
    if (!APP_SECRET) return res.status(500).json({error: "APP_WALLET_SECRET not set"});

    const server = new Server("https://api.testnet.minepi.com"); // Ganti ke https://api.mainnet.minepi.com pas Mainnet
    const source = Keypair.fromSecret(APP_SECRET);
    const account = await server.loadAccount(source.publicKey());

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: "Pi Testnet" // Ganti "Pi Mainnet" pas Mainnet
    })
    .addOperation(Operation.payment({
      destination: FOUNDER,
      asset: Asset.native(),
      amount: "0.1" // Jumlah yang mau di-payout
    }))
    .setTimeout(30)
    .build();

    tx.sign(source);
    const result = await server.submitTransaction(tx);
    console.log("PAYOUT SUCCESS:", result.hash);
    return res.json({ success: true, hash: result.hash, to: FOUNDER });
  } catch (e) {
    console.error("PAYOUT ERROR:", e);
    return res.status(500).json({ error: e.message });
  }
}
