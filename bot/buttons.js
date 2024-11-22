require('dotenv').config()
const {InlineKeyboard, Keyboard} = require("grammy")

module.exports = {

    openWebApp: new InlineKeyboard()
    .webApp("Открыть приложение", process.env.APP_URL),

    checkSubscribeButton: new InlineKeyboard()
    .text("Я подписался!", "checkSubscribe"),

    referralLink: new Keyboard()
    .text("Получить реферальную ссылку", "refLink")
    .resized(),

    // openWebApp: new InlineKeyboard()
    // .url("Открыть приложение", process.env.APP_TG_URL)
}