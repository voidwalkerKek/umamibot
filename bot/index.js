const { getManga, saveManga, getMangasList, removeManga } = require('../scraper/sources');

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome to UmamiBot!');
});

bot.command(['add', 'a', 'A', 'Add', 'ADD'], async (ctx) => {
  try {
    const urlData = ctx.update.message.entities.find(x => x.type == 'url');
    const mangaUrl = ctx.update.message.text.substr(urlData.offset, urlData.length);
    const mangaInfo = await getManga(mangaUrl);
    saveManga(ctx.update.message.chat.id, mangaUrl, mangaInfo);
    ctx.replyWithPhoto(
      {url: mangaInfo.img},
      { caption: `*Added*\n${mangaInfo.title} - Chapter #${mangaInfo.latestChapter.number} \n${mangaInfo.latestChapter.readUrl}\nReleased: ${mangaInfo.latestChapter.released}` });
  } catch (error) {
    console.log(error);
    ctx.replyWithMarkdown('Invalid arguments provided. use /help for more info.');
  }
})

bot.command(['list', 'LIST', 'l', 'L', 'List'], async (ctx) => {
  const list = await getMangasList(ctx.update.message.chat.id);
  ctx.replyWithMarkdown(list);
});

bot.command(['remove', 'r', 'REMOVE', 'R', 'Remove'], async (ctx) => {
  try {
    const commandData = ctx.update.message.entities[0];
    const sourceData = ctx.update.message.entities[1];
    const source = ctx.update.message.text.substr(sourceData.offset, sourceData.length);
    const mangaTitle = ctx.update.message.text.substr(sourceData.offset + sourceData.length).trim();
    const message = await removeManga(ctx.update.message.chat.id, source, mangaTitle);
    ctx.replyWithMarkdown(message);
  } catch (error) {
    console.log(error);
    ctx.replyWithMarkdown('Invalid arguments provided. use /help for more info.');
  }
});

bot.help((ctx) => {
  ctx.reply('Commands \n /a [url] or /add [url]  Add manga to be tracked \n /l or /list to show the list of tracked mangas \n /r [source] [title] or /remove [source] [title] to stop tracking a manga');
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));