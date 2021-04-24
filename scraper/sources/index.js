const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { createFolderIfNotExist, getFileData, removeIllegalCharacters } = require('../../utils/index');
const { getMangasSourceTreeNames } = require('../../utils');
const { SOURCES } = require('../../utils/constants');

const getManga = async function (url) {
  const { get } = SOURCES.find(source => url.includes(source.name));
  return get(url);
}

const saveManga = async function (chat, url, mangaInfo) {
  let yamlStr
  const SOURCE_DIR = `scraper/sources/${mangaInfo.source}`;
  createFolderIfNotExist(path.resolve(SOURCE_DIR));

  const mangaLocalData = getFileData(path.resolve(`scraper/sources/${mangaInfo.source}/${removeIllegalCharacters(mangaInfo.title)}.yaml`));

    if (!mangaLocalData) {
      mangaInfo.readBy = [chat];
      yamlStr = yaml.dump(mangaInfo);
      fs.writeFileSync(path.resolve(`scraper/sources/${mangaInfo.source}/${removeIllegalCharacters(mangaInfo.title)}.yaml`), yamlStr, 'utf8');
    } else {
      if (mangaLocalData.readBy) {
        if (!mangaLocalData.readBy.includes(chat)) {
          mangaLocalData.readBy.push(chat);
        }
      } else {
        mangaLocalData.readBy = [chat];
      }
      yamlStr = yaml.dump({
        ...mangaInfo,
        readBy: mangaLocalData.readBy,
      });
      fs.writeFileSync(path.resolve(`scraper/sources/${mangaInfo.source}/${removeIllegalCharacters(mangaInfo.title)}.yaml`), yamlStr, 'utf8');
    }
}

const getMangasList = async function (chat) {
  let list = '';
  const tree = await getMangasSourceTreeNames();
  for (const source of tree) {
    const mangas = source.children.filter(child => {
      const mangaInfo = getFileData(child.path);
      return mangaInfo.readBy.includes(chat)
    });

    mangas.length ? list += `*${source.name}* \n` : null;

    for (const manga of mangas) {
      const mangaInfo = getFileData(manga.path);
      list += `   [${manga.name}](${mangaInfo.baseUrl}) \n`
    }
  }

  list = list.length > 0 ? list : 'No mangas tracked yet. Add a new manga using the command /add [url]. Use /help for more information.';
  return list;
}

const removeManga = async function (chat, source, mangaTitle) {
  const tree = await getMangasSourceTreeNames();
  const { children } = tree.find((node) => node.name == source);
  const manga = children.find((child) => child.name == mangaTitle);
  mangaInfo = getFileData(manga.path);
  let result = 'Manga not found in tracking list. Try using /list to display the mangas that are being tracked.';
  if (mangaInfo.readBy.includes(chat)) {
    const index = mangaInfo.readBy.indexOf(chat);
    mangaInfo.readBy.splice(index, 1);
    yamlStr = yaml.dump(mangaInfo);
    fs.writeFileSync(path.resolve(`scraper/sources/${mangaInfo.source}/${removeIllegalCharacters(mangaInfo.title)}.yaml`), yamlStr, 'utf8');
    result = 'Manga removed from tracking list.'
  }
  return result;
}

const toggleRandomMangas = async function (chatId) {
  let yamlStr, result;
  const subscribedMessage = 'Subscribed to daily random mangas';
  const unSubscribedMessage = 'Unsubscribed from daily random mangas';
  
  const SOURCE_DIR = `scraper/random-mangas`;
  createFolderIfNotExist(path.resolve(SOURCE_DIR));
  const subscribersList = getFileData(path.resolve(`${SOURCE_DIR}/subscribers.yaml`));

  if (!subscribersList) {
    yamlStr = yaml.dump({subscribers: [chatId]});
    fs.writeFileSync(path.resolve(`${SOURCE_DIR}/subscribers.yaml`), yamlStr, 'utf8');
    result = subscribedMessage;
    return result;
  }

  const { subscribers } = subscribersList;
    if (subscribers.length === 0) {
      subscribers.push(chatId);
      result = subscribedMessage;
    } else {
      const index = subscribers.indexOf(chatId);
      subscribers.splice(index, 1);
      result = unSubscribedMessage;
    }

    yamlStr = yaml.dump({
      subscribers,
    });
    fs.writeFileSync(path.resolve(`${SOURCE_DIR}/subscribers.yaml`), yamlStr, 'utf8');
    return result;
}

module.exports = {
  getManga,
  saveManga,
  getMangasList,
  removeManga,
  toggleRandomMangas
}