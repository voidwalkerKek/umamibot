const mangasIn = require('../scraper/sources/mangasIn');
const manhwa18 = require('../scraper/sources/manhwa18');
const mangafox = require('../scraper/sources/mangafox');
const anzmangas = require('../scraper/sources/anzmangas');
const tmo = require('../scraper/sources/tmo');

const SOURCES = [
  { name: 'mangas.in', get: mangasIn },
  { name: 'anzmangas', get: anzmangas },
  { name: 'manhwa18', get: manhwa18 },
  { name: 'fanfox', get: mangafox },
  { name: 'lectortmo', get: tmo }
];


module.exports = {
  SOURCES
}