const { Telegraf, Telegram } = require("telegraf");
const BOT_TOKEN = require("./secrets");
const pullMedium = require("./index");
const cron = require("node-cron");

const bot = new Telegraf(BOT_TOKEN);
let chatId;
let idArr = [];
bot.start((ctx) => ctx.reply("Welcome Robert!"));
// bot.hears("id", (ctx) => {
//   console.log(ctx.chat.id);
//   chatId = ctx.chat.id;
//   return ctx.reply(ctx.chatId);
// });
let articleLink;
cron.schedule("* * * * *", function () {
  pullMedium()
    .then(function (result) {
      console.log(result);
      articleLink = `[TODAY'S ARTICLE ](${result.rss.channel[0].item[0].link[0]})`;
    })
    .catch((err) => console.error(err));
  setTimeout(
    () =>
      idArr.forEach((user) =>
        bot.telegram.sendMessage(user, articleLink, {
          parse_mode: "markdown",
          disable_web_page_preview: false,
        })
      ),
    1000
  );
});

// pullMedium().then(function (result) {
//   //   console.log(result);
//   articleLink = `[READ THIS >>> ](${result.rss.channel[0].item[0].link[0]})`;
// });
// setTimeout(
//   () =>
//     bot.telegram.sendMessage(964424301, articleLink, {
//       parse_mode: "markdown",
//       disable_web_page_preview: false,
//     }),
//   1000
// );
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => {
  idArr.push(ctx.message.chat.id);
  console.log(idArr);
  return ctx.reply("Hey there");
});
bot.launch();

//chatId = 964424301

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("/subscribe", (ctx) => {
  if (idArr.includes(ctx.message.chat.id)) {
    return ctx.reply("you are already subscribed!");
  } else {
    idArr.push(ctx.message.chat.id);
    console.log(idArr);
    return ctx.reply("successfully subscribed!");
  }
});
bot.hears("id", (ctx) => {
  return ctx.reply(ctx.chat.id);
});
bot.launch();
