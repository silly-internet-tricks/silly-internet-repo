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
  // Please note that only webp and jpg are handled. Add other types as needed.
  const imgs = await glob('./assets/**/*.{webp,jpg}');
  imgs.forEach(async (img) => {
   const tsFilename = img.replace(/(webp|jpg)$/, 'ts');
   try {
    // NOTE: This means that to update the image, the ts file will have to be deleted
    await access(tsFilename);
   } catch (e) {
    const imgBuffer = await readFile(img);
    const base64Img = imgBuffer.toString('base64');
    const fileType = img.match(/(webp|jpg)$/)[1];
    const dataUrl = `data:image/${fileType};base64,${base64Img}`;
    const tsFile = `export default '${dataUrl}';\n`;
    console.log(`now writing file to ${tsFilename}`);
    await writeFile(tsFilename, tsFile);
   }
  });
 };

 processImages();
}
