const puppeteer = require('puppeteer');

module.exports = async function manhwa18(mangaUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(mangaUrl, { waitUntil: 'networkidle2' });

  let data = await page.evaluate(() => {
    try {
      const source = 'manhwa18';
      const title = document.querySelector('.manga-info > h1').innerText;
      const status = document.querySelector('ul > li:nth-child(6) > a.btn.btn-xs.btn-success').innerText;
      const rating = document.querySelectorAll('.h0rating > .h0_ratings_on').length;
      const img = `https://manhwa18.com${document.querySelector('.well > img.thumbnail').getAttribute('src')}`;
      const latestChapter = {
        number: document.querySelector('#tab-chapper .tab-text > table > tbody > tr > td').innerText.replace(/\D/g,''),
        title: document.querySelector('#tab-chapper .tab-text > table > tbody > tr > td').innerText,
        released: document.querySelector('#tab-chapper .tab-text > table > tbody > tr > td:nth-child(2)').innerText,
        readUrl: `https://manhwa18.com/${document.querySelector('#tab-chapper .tab-text > table > tbody > tr > td a').getAttribute('href')}`,
      }
      return {
        source,
        title,
        status,
        img,
        rating,
        currentVolume: null,
        latestChapter
      };
    } catch (error) {
      console.log(error);
    }
  });
  await browser.close();
  return data;
}