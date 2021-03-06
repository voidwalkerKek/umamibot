const cheerio = require('cheerio');
const got = require('got');

module.exports = async function mangasIn(mangaUrl) {
  const response = await got(mangaUrl);
  const $ = cheerio.load(response.body);

  const source = 'anzmangas';
  const baseUrl = mangaUrl;
  const title = $('div.col-sm-12 > h2.widget-title').text().trim();
  const status = $('.col-sm-12 > .row > .col-sm-8 > dl > dd').first().text().trim();
  const rating = $('#item-rating').attr('data-score');
  const img = $('.boxed > img.img-responsive').attr('src');
  const currentVolume = $('.chapters > li').first()
    .text().trim().toLowerCase().includes('volume') ? $('.chapters > li').first().text().trim() : '';
  const currentVolumeClass = currentVolume == '' ? '' : `.${$('.chapters > li').attr('data-volume')}`;
  const latestChapter = {
    number: Number($(`.chapters > li${currentVolumeClass} > h5 > a`).first().text().trim().replace(/[^\d.-]/g, '')),
    title: $(`.chapters > li${currentVolumeClass} > h5 > a`).first().text().trim(),
    released: $(`.chapters > li${currentVolumeClass} > .action > div.date-chapter-title-rtl`).first().text().trim(),
    readUrl: $(`.chapters > li${currentVolumeClass} > h5 > a`).attr('href'),
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