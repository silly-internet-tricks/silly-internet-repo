const webpack = require('webpack');

// TODO: get the files automatically
const files = [
 {
  entryFile: './basic-file.js',
  outputFile: './bundled-basic-file.js',
 },
 {
  entryFile: './no-hot-network-questions.user.js',
  outputFile: './bundled-no-hot-network-questions.user.js',
 },
 {
  entryFile: './sarcasticizer-bundle-version.user.js',
  outputFile: './bundled-sarcasticizer-bundle-version.user.js',
 },
];

files.forEach(({ entryFile, outputFile }) => {
 webpack({
  mode: 'production',
  entry: entryFile,
  output: {
   filename: outputFile,
  },
 }, (err, stats) => {
  // TODO!
  // console.log(err);
  // console.log(stats);
 });
});
