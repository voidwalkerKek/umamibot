var fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const log = (text, err = '') => {
  console.log(`${new Date().toISOString()} | ${text}`, err);
}

const createFolderIfNotExist = async function (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

const getFileData = function (path) {
  let data;
  if (fs.existsSync(path)) {
    let fileContents = fs.readFileSync(path, 'utf8');
    data = yaml.load(fileContents);
  }
  return data;
}

const getMangasSourceTree = async function () {
  const isFile = fileName => {
    return fs.lstatSync(fileName).isFile()
  }
  
  const getFolders = function (folderPath) {
    const sources = [];
    sources.push({ path: fs.readdirSync(folderPath).map(fileName => {
      return path.join(folderPath, fileName).replace(/\\/g, '/');
    }).filter((folder)=> !isFile(folder)), children: []});
  
    return sources;
  }
  
  const getFiles = function (folderPath) {
    const sources = (fs.readdirSync(folderPath).map(fileName => {
      return path.join(folderPath, fileName).replace(/\\/g, '/');
    }).filter(isFile));
  
    return sources;
  }
  
  
  const souceTree = getFolders(`${process.env.SOURCES_FOLDER_PATH}`);
  souceTree.map(node => {
    return node.children = getFiles(node.path.toString());
  });

  return souceTree;
};

module.exports = {
  createFolderIfNotExist,
  getMangasSourceTree,
  getFileData,
  log
}