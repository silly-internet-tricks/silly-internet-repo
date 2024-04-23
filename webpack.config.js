const { globSync } = require('glob');

const userscriptGlob = globSync('./src/*.user.js');
const entryObj = {};

userscriptGlob.forEach((file) => {
 entryObj[file] = { import: `./${file}`, filename: file.match(/[^/]+$/)[0] };
});

console.log(entryObj);

module.exports = {
 mode: 'production',
 entry: entryObj,
};
