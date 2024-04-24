const { glob } = require('glob');
const { readFile } = require('node:fs/promises');

const auth = process.env.PERSONAL_ACCESS_TOKEN;
// console.log('access token length', auth.length);
// eslint-disable-next-line import/no-extraneous-dependencies, no-shadow
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// eslint-disable-next-line import/no-unresolved
import('@octokit/core').then(({ Octokit }) => {
 const octokit = new Octokit({ auth, request: { fetch } });

 (async () => {
  const files = await glob('./@(dist)/**/*.@(user|meta).js');
  const octokitRequestOptions = { files: {} };
  Promise.all(files.map(async (file) => {
   const fileContent = await readFile(file);
   const fileContentString = fileContent.toString();
   const gistIdMatch = fileContentString.match(/downloadURL.*silly-internet-tricks\/(?<gistId>[^/]*)/);
   const gistId = gistIdMatch?.groups?.gistId;
   if (gistIdMatch && gistId) {
    console.log(fileContentString);
    console.log(gistId);
    octokitRequestOptions.gist_id = gistId;
    octokitRequestOptions.description = fileContentString.match(/description\s+(?<description>.*)/).groups.description;
    const filename = file.includes('meta')
     ? fileContentString.match(/updateURL.*raw\/([^/]*)/)[1].trim()
     : fileContentString.match(/downloadURL.*raw\/([^/]*)/)[1].trim();
    octokitRequestOptions.files[filename] = { filename, content: fileContentString };
   }
  })).then(() => {
   console.log(JSON.stringify(octokitRequestOptions));

   octokit.request(`PATCH /gists/${octokitRequestOptions.gist_id}`, octokitRequestOptions);
  });
 })();
});
