const CRON_STRINGS = {
  ongoing_mangas: process.env.NODE_ENV == 'PROD' ? '0,30 * * * *' : '*/0.5 * * * *',
};


module.exports = {
  CRON_STRINGS
}