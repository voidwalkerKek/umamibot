let appInsights = require("applicationinsights");
appInsights.setup().start();
require('dotenv').config();
require('./bot/index');
require('./jobs/check-ongoing-mangas');
