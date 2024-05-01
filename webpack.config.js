const { globSync } = require('glob');

const userscriptGlob = globSync('./ts-compiled/**/*.user.js');
const entryObj = {};

userscriptGlob.forEach((file) => {
 entryObj[file] = { import: `./${file}`, filename: file.replace(/^ts-compiled\/userscripts\//, '') };
});

module.exports = {
 mode: 'production',
 entry: entryObj,
 module: {
  rules: [
   {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /(node_modules|dist)/,
   },
  ],
 },
};
