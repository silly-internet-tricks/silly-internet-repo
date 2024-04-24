const { glob } = require('glob');
const { readFile } = require('node:fs/promises');

const auth = process.env.PERSONAL_ACCESS_TOKEN;
// eslint-disable-next-line import/no-extraneous-dependencies, no-shadow
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// eslint-disable-next-line import/no-unresolved
import('@octokit/core').then(({ Octokit }) => {
 const octokit = new Octokit({ auth, request: { fetch } });

 (async () => {
  const files = await glob('./@(dist)/**/*.@(user|meta).js');

  const octokitRequestsOptions = [];
  Promise.all(files.map(async (file) => {
   const fileContent = await readFile(file);
   const fileContentString = fileContent.toString();
   const gistIdMatch = fileContentString.match(/downloadURL.*silly-internet-tricks\/(?<gistId>[^/]*)/);
   const gistId = gistIdMatch?.groups?.gistId;
   if (gistIdMatch && gistId) {
    console.log(fileContentString);
    console.log(gistId);
    const filename = file.includes('meta')
     ? fileContentString.match(/updateURL.*raw\/([^/]*)/)[1].trim()
     : fileContentString.match(/downloadURL.*raw\/([^/]*)/)[1].trim();

    // find the requestOptions in the array if they're there.
    const requestOptions = octokitRequestsOptions.find((e) => e.gist_id === gistId)
    || (
     octokitRequestsOptions.push({})
      && octokitRequestsOptions[octokitRequestsOptions.length - 1]
    );

    requestOptions.gist_id = gistId;
    requestOptions.description = fileContentString.match(/description\s+(?<description>.*)/).groups.description;
    requestOptions.files[filename] = { filename, content: fileContentString };
   }
  })).then(() => {
   console.log(JSON.stringify(octokitRequestsOptions));

   octokitRequestsOptions.forEach((requestOptions) => {
    octokit.request(`PATCH /gists/${requestOptions.gist_id}`, requestOptions);
   });
  });
 })();
});
