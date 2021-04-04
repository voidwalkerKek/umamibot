const cheerio = require('cheerio');
const got = require('got');

module.exports = async function mangasIn(mangaUrl) {
  const response = await got(mangaUrl);
  const $ = cheerio.load(response.body);
  try {
    const source = 'TMO';
    const title = $('.element-subtitle').first().text().trim();
    const status = $('.book-status').text().trim();
    const rating = $('.score a').text().trim();
    const img = $('.book-thumbnail').attr('src');
    const currentVolume = '';
    const latestChapter = {
      number: Number($('#chapters > ul > li a').first().text().trim().replace(/[^\d.-]/g, '')),
      title: $('#chapters > ul > li a').first().text().trim(),
      released: $('#chapters > ul > li li span.badge').first().text().trim(),
      readUrl: $('#chapters > ul > li li .row .text-right a').first().attr('href'),
    }

    return {
      source,
      title,
      status,
      img,
      rating,
      currentVolume,
      latestChapter
    };
  } catch (error) {
    console.log(error);
  }
}