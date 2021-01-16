const puppeteer = require('puppeteer');

module.exports = async function mangasIn(mangaUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(mangaUrl, { waitUntil: 'networkidle2' });

  let data = await page.evaluate(() => {
    try {
      const source = 'mangas.in';
      const title = document.querySelector('.widget-title').innerText;
      const status = document.querySelector('.manga-name').innerText;
      const rating = document.querySelector('#item-rating').getAttribute('data-score');
      const img = document.querySelector('.boxed > img.img-responsive').getAttribute('src');
      const currentVolume = document.querySelector('.chapters > li')
        .innerText.toLowerCase().includes('volume') ? document.querySelector('.chapters > li').innerText : '';
      const currentVolumeClass = currentVolume == '' ? '' : `.${document.querySelector('.chapters > li').getAttribute('data-volume')}`;
      const latestChapter = {
        number: document.querySelector(`.chapters > li${currentVolumeClass} > h5 > a`).getAttribute('data-number'),
        title: document.querySelector(`.chapters > li${currentVolumeClass} > h5 > i`).innerText,
        released: document.querySelector(`.chapters > li${currentVolumeClass} > .action > div`).innerText,
        readUrl: document.querySelector(`.chapters > li${currentVolumeClass} > h5 > i > a`).getAttribute('href'),
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
  });
  await browser.close();
  return data;
}