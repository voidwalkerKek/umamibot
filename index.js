require('dotenv').config();
let appInsights = require("applicationinsights");
if(process.env.NODE_ENV == 'PROD') {
  appInsights.setup().start();
}
require('./bot/index');
require('./jobs/check-ongoing-mangas');
require('./jobs/get-random-manga');
