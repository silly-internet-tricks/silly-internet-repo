const { readFile, writeFile, access } = require('node:fs/promises');
const { glob } = require('glob');

if (process.env.CI) {
 // stub files for use in github actions
 const fileNames = ['./assets/jeff.ts'];

 fileNames.forEach((fileName) => {
  console.log(`writing stub file for ci: ${fileName}`);
  writeFile(fileName, "export default '';\n");
 });
} else {
 const processImages = async function processImages() {
  // Please note that only webp is handled. Add other types as needed.
  const webps = await glob('./assets/**/*.webp');
  webps.forEach(async (webp) => {
   const tsFilename = webp.replace(/webp$/, 'ts');
   try {
    // NOTE: This means that to update the image, the ts file will have to be deleted
    access(tsFilename);
   } catch (e) {
    console.log(e);
    const webpBuffer = await readFile(webp);
    const base64Webp = webpBuffer.toString('base64');
    const dataUrl = `data:image/webp;base64,${base64Webp}`;
    const tsFile = `export default '${dataUrl}';\n`;
    writeFile(tsFilename, tsFile);
   }
  });
 };

 processImages();
}
