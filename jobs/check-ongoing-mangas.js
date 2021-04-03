const { getManga } = require('../scraper/sources');
const { getMangasSourceTree, getFileData, log } = require('../utils/index');
const cron = require('node-cron');
const chalk = require('chalk');
const fs = require('fs');
const yaml = require('js-yaml');
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const job = cron.schedule('0,30 * * * *', async () => {
  try {
    await getMangasSourceTree().then(async (sourceTree) => {
      sourceTree.forEach(async (node) => {
        for (const child of node.children) {
          const mangaLocalData = getFileData(child);
          log(chalk.yellow(`Checking ${mangaLocalData.title} for new chapters`));
          const mangaOnlineData = await getManga(mangaLocalData.baseUrl);
          if (mangaOnlineData.latestChapter.number != mangaLocalData.latestChapter.number) {
            log(chalk.green(`${mangaOnlineData.title} - Chapter ${mangaOnlineData.latestChapter.number} has been released!`));
            mangaLocalData.readBy.forEach(chatId => {
              bot.telegram.sendPhoto(chatId, {url:mangaOnlineData.img},
                { caption: `*NEW CHAPTER!*\n${mangaOnlineData.title} - Chapter #${mangaOnlineData.latestChapter.number} \n${mangaOnlineData.latestChapter.readUrl}\nReleased: ${mangaOnlineData.latestChapter.released}` }
              );
            });

            let yamlStr = yaml.dump({
              ...mangaOnlineData,
              baseUrl: mangaLocalData.baseUrl,
              readBy: mangaLocalData.readBy,
            });
            fs.writeFileSync(child, yamlStr, 'utf8');
          }
          log(chalk.yellow(`${mangaLocalData.title} Finished`));
        }
      });
    });
  } catch (error) {
    log(`${chalk.red('Error')} - ${error}`);
  }
});

exports.job = job;
