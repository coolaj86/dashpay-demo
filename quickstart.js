"use strict";

require("dotenv").config({ path: ".env" });

let PASSPHRASE = process.env.PASSPHRASE || "YOUR PASSPHRASE GOES HERE";
// Block 500000 is from mid-2021
// TODO how to find the current height?
let SKIP_FROM = 500000;

let Dash = require("dash");
let dash = new Dash.Client({
  network: "testnet", // change when you want to really spend money
  wallet: {
    mnemonic: PASSPHRASE,
  },
  unsafeOptions: {
    skipSynchronizationBeforeHeight: SKIP_FROM,
  },
});
console.info(`Downloading blocks since #${SKIP_FROM}...`);
console.info(`(this may take several minutes)`);
console.info();

async function main() {
  // TODO How to set storage adapter?
  const account = await dash.getWalletAccount();
  let { address } = account.getUnusedAddress();
  console.info(`New address: ${address}`);

  // wait for user to click URL and accept
  await new Promise(function (resolve) {
    console.info("Go to one of these faucets, and fill up yo' address:");
    [
      "https://testnet-faucet.dash.org/",
      "http://faucet.testnet.networks.dash.org/",
      "http://faucet.test.dash.crowdnode.io/",
    ].forEach(function (url) {
      console.info(`    ${url}`);
    });
    console.info();
    console.info("Did you fill up yo' bucket? (and get a confirmation?)");
    console.info("Hit the <any> key to continue...");
    console.info();
    process.stdin.once("data", resolve);
  });
  //process.stdin.pause();

  const balance = account.getConfirmedBalance();
  console.info(`Balance: ${balance}`);
}

main()
  .catch(function (e) {
    console.error(e);
  })
  .then(function () {
    dash.disconnect();
  });
