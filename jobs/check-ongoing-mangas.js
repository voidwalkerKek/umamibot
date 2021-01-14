const { getManga } = require('../scraper/sources');
const { getMangasSourceTree } = require('../utils/index');
const { getFileData, log } = require('../utils/index');
const cron = require('node-cron');
const chalk = require('chalk');
const fs = require('fs');
const yaml = require('js-yaml');
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const job = cron.schedule('*/5 * * * *', () => {
  log(`${chalk.blue('Started')} - Check Ongoing Mangas`);

  try {
    getMangasSourceTree().then((sourceTree) => {
      sourceTree.forEach(node => {
        node.children.forEach(async (child) => {
          const mangaLocalData = getFileData(child);
          const mangaOnlineData = await getManga(mangaLocalData.baseUrl);

          if (new Date(mangaOnlineData.latestChapter.released) > new Date(mangaLocalData.latestChapter.released)) {
            mangaLocalData.readBy.forEach(chatId => {
              bot.telegram.sendPhoto(chatId, mangaOnlineData.img, { caption: `*NEW CHAPTER!*\n${mangaOnlineData.title} - Chapter #${mangaOnlineData.latestChapter.number} \n${mangaOnlineData.latestChapter.readUrl}\nReleased: ${new Date(mangaOnlineData.latestChapter.released).toLocaleDateString()}` });
            });

            let yamlStr = yaml.dump({
              ...mangaOnlineData,
              baseUrl: mangaLocalData.baseUrl,
              readBy: mangaLocalData.readBy,
            });
            fs.writeFileSync(child, yamlStr, 'utf8');
          }
        });
      });
    });
    log(`${chalk.blue('Finished')} - Check Ongoing Mangas`);
  } catch (error) {
    log(`${chalk.red('Error')} - Check Ongoing Mangas`);
  }
});

exports.job = job;
