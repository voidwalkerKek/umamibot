require('dotenv').config();
let appInsights = require("applicationinsights");
if(process.env == 'PROD') {
  appInsights.setup().start();
}
require('./bot/index');
require('./jobs/check-ongoing-mangas');
