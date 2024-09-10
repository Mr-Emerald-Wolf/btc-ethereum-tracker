const { ethers } = require("ethers");
const Deposit = require("../models/deposit");
const { sendNotification } = require("./telegram_service");

let provider, depositContract;

const initTracker = (rpcUrl, contractAddress, abi) => {
  provider = new ethers.JsonRpcProvider(rpcUrl);
  depositContract = new ethers.Contract(contractAddress, abi, provider);
};

// Start tracking block transactions related to the deposit contract
const startTracking = async (contractAddress) => {
  try {
    depositContract.on(
      "DepositEvent",
      async (
        pubkey,
        withdrawal_credentials,
        amount,
        signature,
        index,
        event
      ) => {
        const blockNumber = event.blockNumber;
        const block = await provider.getBlock(blockNumber);

        console.log(`Event: ${event}`);

        for (const txHash of block.transactions) {
          // Check if the transaction interacts with the deposit contract
          tx = await provider.getTransaction(txHash);

          if (tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()) {
            console.log(`Transaction found for contract ${contractAddress}:`);

            // Process the transaction (you can define the actual logic for deposits)
            await processTransaction(tx, pubkey);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error tracking transactions:", error);
  }
};

// Logic to process the transaction
const processTransaction = async (tx, pubkey) => {
  try {
    // Example: Save the transaction to the database
    const newDeposit = new Deposit({
      hash: tx.hash,
      blockTimestamp: (await provider.getBlock(tx.blockNumber)).timestamp,
      fee: Number(tx.gasPrice), // ethers.js BigNumbers need to be converted to string
      amount: Number(tx.value),
      blockNumber: tx.blockNumber,
      pubkey: pubkey,
    });

    await newDeposit.save();

    // Format the notification message
    const message = `
      Transaction Hash: ${tx.hash}\n
      From: ${tx.from}\n
      To: ${tx.to}\n
      Amount: ${amount} Wei ETH\n
      Gas Fee: ${tx.gasPrice} Wei ETH\n
      Block Number: ${tx.blockNumber}
    `;

    await sendNotification(message);
    console.log("Deposit transaction saved:", tx.hash);
  } catch (error) {
    console.error("Error processing transaction:", error);
  }
};

module.exports = {
  initTracker,
  startTracking,
};
