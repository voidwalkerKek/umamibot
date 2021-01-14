const mangasIn = require('./mangasIn');
const fs = require('fs');
const yaml = require('js-yaml');
const { createFolderIfNotExist, getFileData } = require('../../utils/index');

const getManga = async function (url) {
  if (url.includes('mangas.in')) {
    return await mangasIn(url);
  }
}

const saveManga = async function (chat, url, mangaInfo) {
  let yamlStr;
  if (url.includes('mangas.in')) {
    createFolderIfNotExist(`${process.env.SOURCES_FOLDER_PATH}/mangas.in`);
    const mangaLocalData = getFileData(`${process.env.SOURCES_FOLDER_PATH}/mangas.in/${mangaInfo.title}.yaml`);
    if (!mangaLocalData) {
      mangaInfo.baseUrl = url;
      mangaInfo.readBy = [chat];
      yamlStr = yaml.dump(mangaInfo);
      fs.writeFileSync(`${process.env.SOURCES_FOLDER_PATH}/mangas.in/${mangaInfo.title}.yaml`, yamlStr, 'utf8');
    } else {
      if (mangaLocalData.readBy) {
        if (!mangaLocalData.readBy.includes(chat)) {
          mangaLocalData.readBy.push(chat);
        }
      } else {
        mangaLocalData.readBy = [chat];
      }
      yamlStr = yaml.dump(mangaLocalData);
      fs.writeFileSync(`${process.env.SOURCES_FOLDER_PATH}/mangas.in/${mangaInfo.title}.yaml`, yamlStr, 'utf8');
    }
  }
}

module.exports = {
  getManga,
  saveManga
}