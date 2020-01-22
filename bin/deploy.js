const zip = require('adm-zip');
const fs = require('fs');
const package = require('../package.json')

const srcFolder = './src';
const buildFolder = './build';

const modFile = fs.readdirSync(srcFolder).filter((element) => {
    return element.endsWith('.mod');
  });


const zipName = getModName(srcFolder + '/' + modFile[0]);

if(!fs.existsSync(buildFolder)) {
    fs.mkdirSync(buildFolder);
}

const zipArchive = new zip();

zipArchive.addLocalFolder(srcFolder, "", (filename) => {
    return !filename.toLowerCase().endsWith('.gitkeep');
});

const data = zipArchive.toBuffer();

zipArchive.writeZip(`${buildFolder}/${zipName}_${package.version}.zip`);

function getModName(path) {

    const content = fs.readFileSync(path).toString();
    const nonSpacedContent = content.replace(/' '/g, '').replace(/"/g, '');
    const lines = nonSpacedContent.split('\n').map(
      (value) => {
        return value.trim()
      });
  
    const modPath = lines.filter(
      (element) => {
        return element.startsWith('name');
      });
  
      const elementModPath = modPath
      .pop();
  
      const cleanedModPath = elementModPath
      .replace(/name/g, '')
      .replace(/=/g, '')
      .replace(/mod\//g, '')
      .replace(/'/g, '')
      .replace(/ /g, '')
      .trimLeft();
  
      return cleanedModPath;
  }