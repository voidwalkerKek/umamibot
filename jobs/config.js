const CRON_STRINGS = {
  ongoing_mangas: process.env.NODE_ENV == 'DEV' ? '*/0.5 * * * *' : '0,30 * * * *',
};


module.exports = {
  CRON_STRINGS
}