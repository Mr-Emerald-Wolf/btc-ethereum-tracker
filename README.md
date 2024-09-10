# Ethereum Deposit Tracker

## Overview

The Ethereum Deposit Tracker is a robust and efficient system designed to monitor and record ETH deposits on the Beacon Deposit Contract. This project consists of five main components orchestrated using Docker Compose, providing a complete solution for tracking, storing, and visualizing Ethereum deposit data.

## Components

1. **Deposit Tracker (Node.js)**

   - Connects to Ethereum mainnet using Infura's JSON-RPC API.
   - Monitors the Beacon Deposit Contract for new deposits.
   - Retrieves block numbers and fetches all transactions to the contract address.
   - Stores deposit data in MongoDB.
   - Depends on MongoDB and Exporter services.

2. **MongoDB**

   - Stores deposit data collected by the tracker.

3. **Exporter**

   - Custom-built service that exposes Prometheus metrics related to Ethereum deposits.
   - Uses `prom-client` library to create and manage Prometheus metrics.
   - Exposes metrics on port 8080.
   - Depends on MongoDB service.
   - Provides metrics such as latest deposit block number, fee, and timestamp.

4. **Prometheus**

   - Monitors and collects metrics from the Exporter.
   - Runs on port 9090.
   - Depends on Tracker and Exporter services.

5. **Grafana**
   - Visualizes metrics collected by Prometheus.
   - Runs on port 3000.
   - Provides customizable dashboards for deposit data visualization.

## Data Model

The Ethereum deposits are stored in MongoDB using the following schema:

```javascript
const depositSchema = new mongoose.Schema({
  blockNumber: Number,
  blockTimestamp: Date,
  fee: Number,
  amount: Number,
  hash: String,
  pubkey: String,
});
```

This schema captures the following information for each deposit:

- `blockNumber`: The Ethereum block number in which the deposit occurred.
- `blockTimestamp`: The timestamp of the block.
- `fee`: The transaction fee associated with the deposit.
- `amount`: The amount of ETH deposited.
- `hash`: The transaction hash.
- `pubkey`: The public key associated with the deposit.

## Exporter Details

The Exporter component is responsible for exposing Prometheus metrics related to the latest Ethereum deposit. Here's an overview of its functionality:

1. **Metric Initialization**

   - Creates a new Prometheus Registry.
   - Initializes Gauge metrics for latest deposit block number, fee, and timestamp.
   - Sets up collection of default Node.js metrics.

2. **Metric Updates**

   - Fetches the latest deposit from MongoDB based on `blockTimestamp`.
   - Updates the Gauge metrics with the latest deposit information.

3. **Metric Exposure**
   - Exposes the collected metrics for Prometheus to scrape.

The Exporter uses the `prom-client` library to manage Prometheus metrics. It exposes the following custom metrics:

- `latest_deposit_block_number`: Gauge metric representing the block number of the latest deposit.
- `latest_deposit_fee`: Gauge metric representing the fee of the latest deposit.
- `latest_deposit_timestamp`: Gauge metric representing the timestamp of the latest deposit (in seconds since epoch).

In addition to these custom metrics, it also collects default Node.js metrics provided by the `prom-client` library.

## Prerequisites

- Docker
- Docker Compose
- Infura account and API key
- Telegram bot token and chat ID

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ethereum-deposit-tracker.git
   cd ethereum-deposit-tracker
   ```

2. Set up environment variables for the tracker and exporter:

   Create a `.env` file in both the `tracker` and `exporter` subfolders.

   #### Tracker `.env`:

   ```bash
   # MongoDB URI
   MONGO_URI=mongodb://mongodb:27017

   # Ethereum RPC URL
   ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID

   # Contract Address
   CONTRACT_ADDRESS=0x00000000219ab540356cBB839Cbe05303d7705Fa

   # Telegram Bot
   BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
   CHAT_ID=YOUR_TELEGRAM_CHAT_ID
   ```

   #### Exporter `.env`:

   ```bash
   # MongoDB URI
   MONGO_URI=mongodb://mongodb:27017
   ```

   Replace `YOUR_INFURA_PROJECT_ID`, `YOUR_TELEGRAM_BOT_TOKEN`, and `YOUR_TELEGRAM_CHAT_ID` with your actual values.

3. Build and start the services:

   ```bash
   docker-compose up --build
   ```

## Usage

Once the services are up and running:

1. The tracker will automatically start monitoring the Beacon Deposit Contract for new deposits using the configured Ethereum RPC URL.
2. Deposit data will be stored in the MongoDB database according to the schema defined above.
3. The Exporter will expose metrics related to the latest deposit on port 8080.
4. Prometheus will scrape these metrics from the Exporter.
5. Access the Grafana dashboard at `http://localhost:3000` to visualize the deposit data and metrics.
6. Default user and password of grafana is **admin**.
7. New deposits will trigger notifications sent to the configured Telegram chat.

## Configuration

### Tracker Configuration

The tracker's behavior can be modified by adjusting the environment variables in the `tracker/.env` file:

- `MONGO_URI`: The connection string for MongoDB. Default is set to connect to the MongoDB service in the Docker network.
- `ETHEREUM_RPC_URL`: The Ethereum JSON-RPC endpoint. Make sure to use your own Infura project ID or another Ethereum node provider.
- `CONTRACT_ADDRESS`: The address of the Beacon Deposit Contract. This is set to the mainnet contract address by default.
- `BOT_TOKEN`: Your Telegram bot token for sending notifications.
- `CHAT_ID`: The Telegram chat ID where notifications will be sent.

You can also modify the `docker-compose.yml` file to adjust settings such as:

- Port mappings.
- Volume names.
- Dependency relationships between services.

Additional configuration for each service can be found in their respective Dockerfile and configuration files within each service's directory.

## Future Considerations

For future improvements, the project will be migrated to **Golang** for the following benefits:

- **Performance:** Golang provides better performance due to its efficient concurrency model.
- **Type Safety:** Golang’s strong typing system will ensure more reliable code.
- **Goroutines:** Golang's lightweight goroutines will improve concurrent processing, especially for monitoring multiple deposit addresses.

Additionally, the architecture will be expanded to support:

- **Multiple Trackers:** Each tracker will monitor different Ethereum addresses.
- **Kafka Integration:** The trackers will feed deposit data into a Kafka queue, allowing for scalable and decoupled message processing.
- **Exporter Subscription:** Exporters will subscribe to the Kafka queue, aggregate the data, and expose the necessary Prometheus metrics.

This approach will provide a more scalable and efficient monitoring system, allowing for more flexibility and improved performance.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Security Note

The `.env` file contains sensitive information. Never commit this file to version control. Make sure to add `.env` to your `.gitignore` file to prevent accidental commits.
