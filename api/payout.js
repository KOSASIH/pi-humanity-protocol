import * as StellarSdk from '@stellar/stellar-sdk';
const { Keypair, Asset, Operation, TransactionBuilder, BASE_FEE } = StellarSdk;
const Server = StellarSdk.Horizon ? StellarSdk.Horizon.Server : StellarSdk.Server;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const APP_SECRET = process.env.APP_WALLET_SECRET;
    const FOUNDER = "GCKUNNC6X6LKYJXKTQEJAQQ2J6NTIHMRNJFM2KY6KIBB46BOPMKVXDQN";
    if (!APP_SECRET) return res.status(500).json({error: "APP_WALLET_SECRET not set"});

    const server = new Server("https://api.testnet.minepi.com");
    const source = Keypair.fromSecret(APP_SECRET);
    const account = await server.loadAccount(source.publicKey());

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: "Pi Testnet"
    })
    .addOperation(Operation.payment({
      destination: FOUNDER,
      asset: Asset.native(),
      amount: "0.1"
    }))
    .setTimeout(30)
    .build();

    tx.sign(source);
    const result = await server.submitTransaction(tx);
    console.log("PAYOUT SUCCESS:", result.hash);
    return res.json({ success: true, hash: result.hash, to: FOUNDER });
  } catch (e) {
    console.error("PAYOUT ERROR:", e);
    return res.status(500).json({ error: e.response?.data || e.message });
  }
}
