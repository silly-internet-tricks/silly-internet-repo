const webpack = require('webpack');

const files = [
  {
    entryFile: './basic-file.js',
    outputFile: './bundled-basic-file.js',
  },
  {
    entryFile: './no-hot-network-questions.user.js',
    outputFile: './bundled-no-hot-network-questions.user.js',
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
    // console.log(err);
    // console.log(stats);
  });
});
