import dotenv from "dotenv";
import sha256 from "crypto-js/sha256.js";
import { Network, Alchemy } from "alchemy-sdk";

// Load environment variables
dotenv.config();

const settings = {
  apiKey: process.env.API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// get the latest block
const latestBlock = alchemy.core.getBlock("latest").then(console.log);

class CryptoBlock {
  constructor(index, timestamp, data, precedingHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return sha256(
      this.index +
        this.precedingHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  proofofWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

class CryptoBlockChain {
  constructor() {
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
  }

  startGenesisBlock() {
    return new CryptoBlock(0, "25/12/2023", "Initial Block in the Chain", "0");
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  addNewBlock(newBlock) {
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    newBlock.proofofWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) return flase;
      if (currentBlock.precedingHash !== precedingBlock.hash) return flase;
    }
    return true;
  }
}

let crypto = new CryptoBlockChain();

console.log("the crypto mining in progress...");

crypto.addNewBlock(
  new CryptoBlock(1, "25/12/2023", {
    sender: "Ibrahim",
    recipient: "Khalil",
    quantity: 50,
  })
);

crypto.addNewBlock(
  new CryptoBlock(2, "25/12/2023", {
    sender: "Khalil",
    recipient: "Ibrahim",
    quantity: 100,
  })
);

console.log(JSON.stringify(crypto, null, 4));
