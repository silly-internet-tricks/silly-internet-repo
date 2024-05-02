const { readFile, writeFile } = require('node:fs/promises');
const { glob } = require('glob');

// reference the file at https://github.com/joshparkerj/silly-internet-tricks/blob/main/bundle-build.js

// TODO: update the eslint config to handle this file
const delimiter = '==/UserScript==\n';

const processBundles = async function processBundles() {
 const userscriptGlob = await glob('./ts-compiled/**/*.user.js');
 const bundledUserscriptGlob = await glob('./dist/**/*.user.js');
 userscriptGlob.forEach(async (file) => {
  const fileContents = await readFile(file);

  const name = file.match(/([^./]+).user.js$/)[1];

  const userscriptHeader = fileContents.toString().split(delimiter)[0] + delimiter;

  if (!userscriptHeader.match(/@source/)) {
    console.warn(`${file} is missing the source field in its metadata`);
  }

  const sourceEditedUserscriptHeader = userscriptHeader.replace(/(@source.*main\/src)(.*)/, (_, m1) => `${m1}${file.replace('ts-compiled', '').replace('user.js', 'user.ts')}`);
  const downloadurlEditedUserscriptHeader = sourceEditedUserscriptHeader.replace(/(@downloadURL.*raw\/)(.*)/, (_, m1) => `${m1}${file.match(/[^/]*$/)[0]}`);
  const updateurlEditedUserscriptHeader = downloadurlEditedUserscriptHeader.replace(/(@downloadURL.*raw\/)(.*)/, (_, m1) => `${m1}${file.match(/[^/]*$/)[0].replace('.user.js', '.meta.js')}`);

  const distFile = bundledUserscriptGlob.find((e) => e.includes(name));

  const distFileContents = await readFile(distFile);
  const bundleWithHeader = updateurlEditedUserscriptHeader + distFileContents.toString();
  await writeFile(distFile, bundleWithHeader);

  const metaFile = distFile.replace('user.js', 'meta.js');
  await writeFile(metaFile, updateurlEditedUserscriptHeader);
 });
};

processBundles();
