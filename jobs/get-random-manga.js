const { getRandomManga } = require('../scraper/sources/mangasIn');
const { log, getFileData } = require('../utils/index');
const path = require('path');
const cron = require('node-cron');
const chalk = require('chalk');
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const { CRON_STRINGS: {randomManga} } = require('./config');

const jobRandomManga = cron.schedule(randomManga, async () => {
  try {
    log(chalk.blue(`Getting a random manga`));
    const manga = await getRandomManga();
    
    const subscribersData = getFileData(path.resolve('./scraper/random-mangas/subscribers.yaml'));

    if (subscribersData && subscribersData.subscribers.length > 0) {
      const { subscribers } = subscribersData;
      subscribers.forEach(chatId => {
        bot.telegram.sendPhoto(chatId, {url:manga.img},
          { caption: `*RANDOM MANGA OF THE DAY*\n\n${manga.title} \nRating: ${manga.rating} \n18+: ${manga.NSFW} \nStatus: ${manga.status}\n ${manga.baseUrl}` }
        );   
      });
    }
  } catch (error) {
    console.error(error);
  }
});

exports.jobRandomManga = jobRandomManga;