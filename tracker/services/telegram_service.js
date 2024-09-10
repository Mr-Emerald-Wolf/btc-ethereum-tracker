const { Telegraf } = require("telegraf");

let bot, chatId;

const initTelegram = (botToken, newChatId) => {
  chatId = newChatId; // Use a different name to avoid shadowing the parameter
  bot = new Telegraf(botToken);
};

const sendNotification = async (message) => {
  try {
    await bot.telegram.sendMessage(chatId, message); // Use globalChatId here
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

module.exports = {
  initTelegram,
  sendNotification,
};
