const { getManga, saveManga } = require('../scraper/sources');

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome to UmamiBot!');
});

bot.command(['add', 'a'], async (ctx) => {
  try {
    const urlData = ctx.update.message.entities.find(x => x.type == 'url');
    const mangaUrl = ctx.update.message.text.substr(urlData.offset, urlData.length);
    const mangaInfo = await getManga(mangaUrl);
    saveManga(ctx.update.message.chat.id, mangaUrl, mangaInfo);
    ctx.replyWithPhoto(mangaInfo.img, {caption: `*Added*\n${mangaInfo.title} - Chapter #${mangaInfo.latestChapter.number} \n${mangaInfo.latestChapter.readUrl}\nReleased: ${new Date(mangaInfo.latestChapter.released).toLocaleDateString()}`});
  } catch (error) {
    console.log(error);
  }
})

bot.help((ctx) => {
  ctx.reply('Commands \n /a [url] or /add [url]  Add manga to be tracked \n');
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));