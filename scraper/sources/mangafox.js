const cheerio = require('cheerio');
const got = require('got');

module.exports = async function mangasIn(mangaUrl) {
  const response = await got(mangaUrl);
  const $ = cheerio.load(response.body);
  try {
    const source = 'mangafox';
    const baseUrl = mangaUrl;
    const title = $('.detail-info-right-title-font').text().trim();
    const status = $('.detail-info-right-title-tip').text().trim();
    const rating = $('.detail-info-right-title-star > span.item-score').text().trim();
    const img = $('img.detail-info-cover-img').attr('src');
    const latestChapter = {
      number: $(`ul.detail-main-list > li > a > div.detail-main-list-main > p.title3`).first().text().trim().replace(/\D/g, ''),
      title:$(`ul.detail-main-list > li > a > div.detail-main-list-main > p.title3`).first().text().trim(),
      released: $(`ul.detail-main-list > li > a > div.detail-main-list-main > p.title2`).first().text().trim(),
      readUrl: `http://fanfox.net${$(`ul.detail-main-list > li > a`).attr('href')}`,
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
  } catch (error) {
    console.log(error);
  }
}