const CRON_STRINGS = {
  ongoing_mangas: process.env.NODE_ENV == 'DEV' ? '*/0.5 * * * *' : '0,30 * * * *',
  randomManga: process.env.NODE_ENV == 'DEV' ? '*/0.5 * * * *' : '0 08 * * *',
};


module.exports = {
  CRON_STRINGS
}