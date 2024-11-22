require('dotenv').config()
const { Bot, InlineKeyboard } = require("grammy")
const { commands } = require("./commands")
const { openWebApp } = require("./buttons")

const token = process.env.BOT_TOKEN;

const bot = new Bot(token)

async function connectBot() {

    try {
        await bot.api.setMyCommands(commands)

        bot.command("start", async (ctx) => {
            ctx.reply(`Добро пожаловать ${ctx.from?.first_name}`,
                {
                    reply_markup: openWebApp
                })
        })

        bot.command("help", async (ctx) => {
            ctx.reply(`Сайт проекта`,
                {
                    reply_markup: new InlineKeyboard()
                        .webApp("Открыть сайт", process.env.APP_URL)
                })
        })

        bot.start();

    } catch (e) {
        console.log("BOT START ERROR", e)
    }
}

module.exports = {connectBot, bot}

