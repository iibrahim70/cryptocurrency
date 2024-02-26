import dotenv from "dotenv";
import Web3 from "web3";

// Load environment variables
dotenv.config();

const node = `https://go.getblock.io/${process.env.API_KEY_GETBLOCK}/goerli`;

const web3 = new Web3(node);

const accountTo = web3.eth.accounts.create();
const accountFrom = web3.eth.accounts.privateKeyToAccount(
  process.env.PRIVATE_KEY_METAMASK
);

console.log(accountFrom);

const createSignedTx = async (rawTx) => {
  rawTx.gas = await web3.eth.estimateGas(rawTx);
  return await accountFrom.signTransaction(rawTx);
};

const sendSignedTx = async (signedTx) => {
  web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(console.log);
};

const amountTo = "0.01";
const rawTx = {
  to: accountTo.address,
  value: web3.utils.toWei(amountTo, "ether"),
};

createSignedTx(rawTx).then(sendSignedTx);

// console.log("Private Key:", process.env.PRIVATE_KEY_METAMASK);
