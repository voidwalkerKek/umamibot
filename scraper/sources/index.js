const mangasIn = require('./mangasIn');
const manhwa18 = require('./manhwa18');
const fs = require('fs');
const yaml = require('js-yaml');
const { createFolderIfNotExist, getFileData, removeIllegalCharacters } = require('../../utils/index');
const { getMangasSourceTreeNames } = require('../../utils');
const { title } = require('process');

const getManga = async function (url) {
  if (url.includes('mangas.in')) {
    const data = await mangasIn(url);
    return data;
  } else if (url.includes('manhwa18')) {
    const data = await manhwa18(url);
    return data;
  }
}

const saveManga = async function (chat, url, mangaInfo) {
  let yamlStr;

  try {
    createFolderIfNotExist(`./scraper/sources/${mangaInfo.source}`);
    const mangaLocalData = getFileData(`./scraper/sources/${mangaInfo.source}/${removeIllegalCharacters(mangaInfo.title)}.yaml`);
    if (!mangaLocalData) {
      mangaInfo.baseUrl = url;
      mangaInfo.readBy = [chat];
      yamlStr = yaml.dump(mangaInfo);
      fs.writeFileSync(`./scraper/sources/${mangaInfo.source}/${removeIllegalCharacters(mangaInfo.title)}.yaml`, yamlStr, 'utf8');
    } else {
      if (mangaLocalData.readBy) {
        if (!mangaLocalData.readBy.includes(chat)) {
          mangaLocalData.readBy.push(chat);
        }
      } else {
        mangaLocalData.readBy = [chat];
      }
      yamlStr = yaml.dump(mangaLocalData);
      fs.writeFileSync(`./scraper/sources/${mangaInfo.source}/${removeIllegalCharacters(mangaInfo.title)}.yaml`, yamlStr, 'utf8');
    }
  } catch (error) {
    console.log(error);
  }
}

const getMangasList = async function (chat) {
  const tree = await getMangasSourceTreeNames();
  let list = '';
  for (const source of tree) {
    list += `*${source.name}* \n`;
    for (const title of source.children) {
      mangaInfo = getFileData(title.path);
      if (mangaInfo.readBy.includes(chat)) {
        list += `   [${title.name}](${mangaInfo.baseUrl}) \n`
      }
    }
  }
  return list;
}

const removeManga = async function (chat, source, mangaTitle) {
  const tree = await getMangasSourceTreeNames();
  const currentSource = tree.find((node) => node.name == source);
  const manga = currentSource.children.find((child) => child.name == mangaTitle);
  mangaInfo = getFileData(manga.path);
  let result = '';
  if (mangaInfo.readBy.includes(chat)) {
    const index = mangaInfo.readBy.indexOf(chat);
    mangaInfo.readBy.splice(index, 1);
    yamlStr = yaml.dump(mangaInfo);
      fs.writeFileSync(`./scraper/sources/${mangaInfo.source}/${removeIllegalCharacters(mangaInfo.title)}.yaml`, yamlStr, 'utf8');
    result = 'Manga removed from tracking list.'
  } else {
    result = 'Manga not found in tracking list. Try using /list to display the mangas that are being tracked.';
  }
  return result;
}

module.exports = {
  getManga,
  saveManga,
  getMangasList,
  removeManga
}