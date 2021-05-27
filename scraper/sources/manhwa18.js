const cheerio = require('cheerio');
const got = require('got');

module.exports = async function manhwa18(mangaUrl) {
  const response = await got(mangaUrl);
  const $ = cheerio.load(response.body);
  try {
    const source = 'manhwa18';
    const baseUrl = mangaUrl;
    const title = $('.manga-info > h1').text().trim();
    const status = $('ul > li:nth-child(6) > a.btn.btn-xs.btn-success').text().trim();
    const rating = $('.h0rating > .h0_ratings_on').length;
    const img = `https://manhwa18.com${$('.well > img.thumbnail').attr('src')}`;
    const latestChapter = {
      number: Number($('#tab-chapper .tab-text > table > tbody > tr > td').first().text().trim().replace(/\D/g, '')),
      title: $('#tab-chapper .tab-text > table > tbody > tr > td').first().text().trim(),
      released: $('#tab-chapper .tab-text > table > tbody > tr > td:nth-child(2)').first().text().trim(),
      readUrl: `https://manhwa18.com/${$('#tab-chapper .tab-text > table > tbody > tr > td a').attr('href')}`,
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