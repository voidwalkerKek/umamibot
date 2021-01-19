const cheerio = require('cheerio');
const got = require('got');

module.exports = async function mangasIn(mangaUrl) {
  const response = await got(mangaUrl);
  const $ = cheerio.load(response.body);
  try {
    const source = 'mangas.in';
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