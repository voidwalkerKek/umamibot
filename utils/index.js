var fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const log = (text, err = '') => {
  console.log(`${new Date().toISOString()} | ${text}`, err);
}

const removeIllegalCharacters = function (filename) {
  return filename.replace(/[/\\?%*:|"<>]/g, '-');
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
    return fs.lstatSync(fileName).isFile();
  }

  const getFolders = function (folderPath) {
    const tree = fs.readdirSync(folderPath).map(fileName => {
      return path.join(folderPath, fileName).replace(/\\/g, '/');
    }).filter((folder) => !isFile(folder));
    return tree.map(node => { return { path: node, children: [] }; });
  }

  const getFiles = function (folderPath) {
    const sources = (fs.readdirSync(folderPath).map(fileName => {
      return path.join(folderPath, fileName).replace(/\\/g, '/');
    }).filter(isFile));

    return sources;
  }


  const souceTree = getFolders(path.resolve('./scraper/sources/'));
  souceTree.map(node => {
    return node.children = getFiles(node.path.toString());
  });

  return souceTree;
};

const getMangasSourceTreeNames = async function () {
  const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
  }

  const getFolders = function (folderPath) {
    const tree = fs.readdirSync(folderPath).map(fileName => {
      return {path: path.join(folderPath, fileName).replace(/\\/g, '/'), name: fileName};
    }).filter((folder) => !isFile(folder.path));
    return tree.map(node => { return { path: node.path, name: node.name, children: [] }; });
  }

  const getFiles = function (folderPath) {
    const sources = (fs.readdirSync(folderPath).map(fileName => {
      return {path: path.join(folderPath, fileName).replace(/\\/g, '/'), name: fileName.replace('.yaml', '')};
    }).filter((child) => isFile(child.path)));

    return sources;
  }


  const souceTree = getFolders(path.resolve('./scraper/sources/'));
  souceTree.map(node => {
    return node.children = getFiles(node.path.toString());
  });

  return souceTree;
};

module.exports = {
  createFolderIfNotExist,
  getMangasSourceTree,
  getMangasSourceTreeNames,
  getFileData,
  removeIllegalCharacters,
  log
}