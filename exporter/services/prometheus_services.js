const promClient = require("prom-client");
const Deposit = require('../models/deposit'); // Ensure you import your model

let register;
let latestBlockNumberGauge;
let latestFeeGauge;
let latestTimestampGauge;

const initializeMetrics = () => {
  // Create a new Prometheus Registry
  register = new promClient.Registry();

  // Create custom Prometheus metrics for the latest deposit
  latestBlockNumberGauge = new promClient.Gauge({
    name: "latest_deposit_block_number",
    help: "Block number of the latest deposit",
    registers: [register],
  });

  latestFeeGauge = new promClient.Gauge({
    name: "latest_deposit_fee",
    help: "Fee of the latest deposit",
    registers: [register],
  });

  latestTimestampGauge = new promClient.Gauge({
    name: "latest_deposit_timestamp",
    help: "Timestamp of the latest deposit (in seconds since epoch)",
    registers: [register],
  });

  // You can also collect default metrics like process memory, CPU usage
  promClient.collectDefaultMetrics({ register });
};

// Function to update metrics
const updateLatestDepositMetrics = async () => {
  try {
    // Fetch the latest deposit based on blockTimestamp
    const latestDeposit = await Deposit.findOne().sort({ blockTimestamp: -1 });

    if (latestDeposit) {
      latestBlockNumberGauge.set(latestDeposit.blockNumber); // Set block number gauge
      latestFeeGauge.set(latestDeposit.fee); // Set fee gauge
      latestTimestampGauge.set(Math.floor(new Date(latestDeposit.blockTimestamp).getTime() / 1000)); // Set timestamp gauge in seconds
    }
  } catch (error) {
    console.error("Error updating latest deposit metrics:", error);
  }
};

// Export function to return Prometheus metrics
const getMetrics = async () => {
  if (!register) {
    throw new Error("Metrics have not been initialized. Call initializeMetrics() first.");
  }
  return await register.metrics();
};

module.exports = { updateLatestDepositMetrics, getMetrics, initializeMetrics };
