const cheerio = require('cheerio');
const got = require('got');

async function mangasIn(mangaUrl) {
  const response = await got(mangaUrl);
  const $ = cheerio.load(response.body);

  const source = 'mangas.in';
  const baseUrl = mangaUrl;
  const title = $('div.col-sm-12 > h2.widget-title').text().trim();
  const status = $('.manga-name').first().text().trim();
  const rating = $('#item-rating').attr('data-score');
  const img = $('.boxed > img.img-responsive').attr('src');
  const currentVolume = $('.chapters > li').first()
    .text().trim().toLowerCase().includes('volume') ? $('.chapters > li').first().text().trim() : '';
  const currentVolumeClass = currentVolume == '' ? '' : `.${$('.chapters > li').attr('data-volume')}`;
  const latestChapter = {
    number: $(`.chapters > li${currentVolumeClass} > h5 > a`).attr('data-number'),
    title: $(`.chapters > li${currentVolumeClass} > h5 > i`).first().text().trim(),
    released: $(`.chapters > li${currentVolumeClass} > .action > div.date-chapter-title-rtl`).first().text().trim(),
    readUrl: $(`.chapters > li${currentVolumeClass} > h5 > i > a`).attr('href'),
  }

  return {
    source,
    baseUrl,
    title,
    status,
    img,
    rating,
    latestChapter
  };
}

async function getRandomManga() {
  const response = await got('https://mangas.in/random');
  const $ = cheerio.load(response.body);

  const source = 'mangas.in';
  const baseUrl = $('meta[property="og:url"]').attr('content');
  const title = $('div.col-sm-12 > h2.widget-title').text().trim();
  const status = $('.manga-name').first().text().trim();
  const summary = $('div.well > p').text().trim().length > 0 ? $('div.well > p').text().trim() : 'N/A'
  const rating = $('#item-rating').attr('data-score');
  const img = $('.boxed > img.img-responsive').attr('src');
  const NSFW = $('i.adult').val !== undefined ? 'Yes' : 'No';

  return {
    source,
    baseUrl,
    title,
    status,
    summary,
    img,
    rating,
    NSFW
  };
}

module.exports = {
  mangasIn,
  getRandomManga
}