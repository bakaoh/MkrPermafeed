const Maker = require("@makerdao/dai");
const fs = require("fs");
const Arweave = require("arweave/node");
const argv = require("yargs").argv;

// Set Arweave parameters from commandline or defaults.
const arweave_port = argv.arweavePort ? argv.arweavePort : 443;
const arweave_host = argv.arweaveHost ? argv.arweaveHost : "arweave.net";
const arweave_protocol = argv.arweaveProtocol ? argv.arweaveProtocol : "https";

if (!argv.walletFile) {
  console.error(
    "ERROR: Please specify a wallet file to load using argument " +
      "'--wallet-file <PATH>'."
  );
  process.exit();
}

const raw_wallet = fs.readFileSync(argv.walletFile);
const wallet = JSON.parse(raw_wallet);

const arweave = Arweave.init({
  host: arweave_host,
  port: arweave_port,
  protocol: arweave_protocol
});

async function archive() {
  const maker = await Maker.create("http", {
    url: "https://mainnet.infura.io/TLNJutB9tVbAFdEr3IyY",
    log: false
  });

  await maker.authenticate();
  const price = maker.service("price");
  const ethCdp = maker.service("cdp");
  const tokenService = maker.service("token");
  const dai = tokenService.getToken(Maker.DAI);

  const [
    ethPrice,
    mkrPrice,
    pethPrice,
    wethToPeth,
    collateralization,
    daiSupply
  ] = await Promise.all([
    price.getEthPrice(),
    price.getMkrPrice(),
    price.getPethPrice(),
    price.getWethToPethRatio(),
    ethCdp.getSystemCollateralization(),
    dai.totalSupply()
  ]);

  const now = new Date();
  const data = JSON.stringify({
    utc: now.toUTCString(),
    ethPrice: ethPrice.toString(),
    mkrPrice: mkrPrice.toString(),
    pethPrice: pethPrice.toString(),
    daiSupply: daiSupply.toString(),
    wethToPeth,
    collateralization
  });
  console.log(`Data: ${data}`);

  let date = now.toISOString().split("T")[0];
  let hour = now.getHours();

  let tx = await arweave.createTransaction({ data }, wallet);
  tx.addTag("Content-Type", "application/json");
  tx.addTag("Stream-Name", "mkr");
  tx.addTag("Date", date);
  tx.addTag("Hour", hour.toString());
  await dispatchTX(tx);
}

async function dispatchTX(tx) {
  // Manually set the transaction anchor, for now.
  const anchor_id = await arweave.api.get("/tx_anchor").then(x => x.data);
  tx.last_tx = anchor_id;

  // Sign and dispatch the TX.
  await arweave.transactions.sign(tx, wallet);
  let resp = await arweave.transactions.post(tx);

  let output =
    `Transaction ${tx.get("id")} dispatched to ` +
    `${arweave_host}:${arweave_port} with response: ${resp.status}.`;
  console.log(output);
}

module.exports = async function run() {
  if (new Date().getMinutes() !== 0) {
    console.error(
      `Current minutes is ${new Date().getMinutes()}, not running.`
    );
    process.exit();
  }

  const address = await arweave.wallets.jwkToAddress(wallet);
  let balance = arweave.ar.winstonToAr(
    await arweave.wallets.getBalance(address)
  );
  console.log(`Using wallet ${address} (balance: ${balance} AR).`);

  archive()
    .catch(err => console.error(err))
    .finally(() => process.exit());
};
