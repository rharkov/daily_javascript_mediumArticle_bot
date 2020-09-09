const { Telegraf } = require("telegraf");
const BOT_TOKEN = require("./secrets");
const pullMedium = require("./index");
const cron = require("node-cron");
const User = require("./db/user");

User.sync();
const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => {
  ctx.reply("Welcome To Daily Medium Article Bot!");
  return ctx.reply(
    "commands: /subscribe - to subscribe and /unsubscribe - to unsubscribe"
  );
});
let articleLink;

cron.schedule("* * * * *", function () {
  pullMedium()
    .then(function (result) {
      articleLink = `[TODAY'S ARTICLE ](${result.rss.channel[0].item[0].link[0]})`;
      (async () => {
        const users = await User.findAll({ attributes: ["chatId"] });
        users.forEach((user) =>
          bot.telegram.sendMessage(user.dataValues.chatId, articleLink, {
            parse_mode: "markdown",
            disable_web_page_preview: false,
          })
        );
      })();
    })
    .catch((err) => console.error(err));
});
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.launch();

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("/subscribe", async (ctx) => {
  try {
    const userCreated = await User.create({ chatId: ctx.message.chat.id });
    return ctx.reply("successfully subscribed! Enjoy the knowledge");
  } catch (error) {
    return ctx.reply("you are already subscribed!");
  }
});
bot.hears("/unsubscribe", async (ctx) => {
  const deletedUser = await User.destroy({
    where: {
      chatId: ctx.message.chat.id,
    },
  });
  return ctx.reply("successfully unsubscribed, see you again!");
});
bot.hears("id", (ctx) => {
  return ctx.reply(ctx.chat.id);
});
bot.launch();
