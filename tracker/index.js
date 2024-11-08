require("dotenv").config();
const mongoose = require("mongoose");
const { initTracker, startTracking } = require("./services/tracker_service");
const { initTelegram, sendNotification } = require("./services/telegram_service");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const ethereumRpcUrl = process.env.ETHEREUM_RPC_URL;
const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = require("./abi.json");

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

initTelegram(botToken, chatId);
initTracker(ethereumRpcUrl, contractAddress, abi);

sendNotification("Telegram Notifications Live");
startTracking(contractAddress);
