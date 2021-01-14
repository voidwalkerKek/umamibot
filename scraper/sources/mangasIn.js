const puppeteer = require('puppeteer');

module.exports = async function mangasIn(mangaUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(mangaUrl);

  let data = await page.evaluate(() => {
    const title = document.querySelector('.widget-title').innerText;
    const status = document.querySelector('.manga-name').innerText;
    const rating = document.querySelector('#item-rating').getAttribute('data-score');
    const img = document.querySelector('img.img-responsive').getAttribute('src');
    const currentVolume = document.querySelector('.chapters > li').innerText;
    const currentVolumeClass = document.querySelector('.chapters > li').getAttribute('data-volume');
    const latestChapter = {
      number: document.querySelector(`.chapters > li.${currentVolumeClass} > h5 > a`).getAttribute('data-number'),
      title: document.querySelector(`.chapters > li.${currentVolumeClass} > h5 > i`).innerText,
      released: document.querySelector(`.chapters > li.${currentVolumeClass} > .action > div`).innerText,
      readUrl: document.querySelector(`.chapters > li.${currentVolumeClass} > h5 > i > a`).getAttribute('href'),
    }

    return {
      title,
      status,
      img,
      rating,
      currentVolume,
      latestChapter
    };

  });
  await browser.close();
  return data;
}