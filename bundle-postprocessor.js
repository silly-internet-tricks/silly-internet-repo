const { readFile, writeFile } = require('node:fs/promises');
const { glob } = require('glob');

// reference the file at https://github.com/joshparkerj/silly-internet-tricks/blob/main/bundle-build.js

const delimiter = '==/UserScript==\n';

const processBundles = async function processBundles() {
 const userscriptGlob = await glob('./src/*.user.js');
 const bundledUserscriptGlob = await glob('./dist/*.user.js');
 userscriptGlob.forEach(async (file) => {
  const fileContents = await readFile(file);

  const name = file.match(/^src\/([^.]+).user.js$/)[1];

  const userscriptHeader = fileContents.toString().split(delimiter)[0] + delimiter;
  const distFile = bundledUserscriptGlob.find((e) => e.includes(name));

  const distFileContents = await readFile(distFile);
  const bundleWithHeader = userscriptHeader + distFileContents.toString();
  await writeFile(distFile, bundleWithHeader);

  const metaFile = distFile.replace('user.js', 'meta.js');
  await writeFile(metaFile, userscriptHeader);
 });
};

processBundles();
