/**
 * Used during developpment process to symlink the src with the ck 2 folder and sync the .mod file
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const srcFolder = './src';

/**
 * Get the Crusader King II folder depending on OS
 */
function getPathFromOS() {

  let path = os.homedir();

  switch (os.platform()) {
    case "win32":
      path += '/documents/Paradox Interactive/Crusader Kings II/'
      break;
    case 'darwin':
      path += '/.paradoxinteractive/Crusader Kings II/';
      break;
    case 'linux':
      path += '/.paradoxinteractive/Crusader Kings II/';
      break;
    default:
      path += '/.paradoxinteractive/Crusader Kings II/';
      break;
  }

  return path;

}

function getModFolder(path) {

  const content = fs.readFileSync(path).toString();
  const nonSpacedContent = content.replace(/' '/g, '').replace(/"/g, '');
  const lines = nonSpacedContent.split('\n').map(
    (value) => {
      return value.trim()
    });

  const modPath = lines.filter(
    (element) => {
      return element.startsWith('path');
    });

    const elementModPath = modPath
    .pop();

    const cleanedModPath = elementModPath
    .replace(/path/g, '')
    .replace(/=/g, '')
    .replace(/mod\//g, '')
    .trimLeft();

    return cleanedModPath;
}

const ck2Folder = getPathFromOS();

if (!fs.existsSync(ck2Folder)) {
  console.error("Can't find the Crusader Kings 2 documents folder, please launch the game once ");
  process.exit();
}

const modFile = fs.readdirSync(srcFolder).filter((element) => {
  return element.endsWith('.mod');
});

if (modFile === undefined) {
  console.error("Missing mod file in src folder, please create mod file !");
  process.exit();
}


fs.copyFileSync(srcFolder + '/' + modFile, ck2Folder + 'mod/' + modFile);

const modSymlink = srcFolder + '/' + getModFolder(srcFolder + '/' + modFile);
const ck2ModFolder = ck2Folder + '/mod/';
const ck2ModFolderMod = ck2ModFolder + getModFolder(srcFolder + '/' + modFile);

if (!fs.existsSync(ck2ModFolderMod)) {
  fs.symlinkSync(path.resolve(modSymlink), path.resolve(ck2ModFolderMod), 'junction');
  console.log('Symlink created between developement source folder and Crusader King 2 mod folder');
}