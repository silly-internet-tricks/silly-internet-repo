const { glob } = require('glob');
const { readFile } = require('node:fs/promises');

const auth = process.env.PERSONAL_ACCESS_TOKEN;
// eslint-disable-next-line import/no-extraneous-dependencies, no-shadow
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// eslint-disable-next-line import/no-unresolved
import('@octokit/core').then(({ Octokit }) => {
 const octokit = new Octokit({ auth, request: fetch });

 (async () => {
  const files = await glob('./@(dist)/**/*.@(user|meta).js');
  files.forEach(async (file) => {
   const fileContent = await readFile(file);
   const fileContentString = fileContent.toString();
   const gistIdMatch = fileContentString.match(/downloadURL.*silly-internet-tricks\/([^/]*)/);
   if (gistIdMatch) {
    const gistId = gistIdMatch[1];
    const description = fileContentString.match(/description\s+(.*)/)[1];
    const filename = file.includes('meta')
     ? fileContentString.match(/updateURL.*raw\/([^/]*)/)[1]
     : fileContentString.match(/downloadURL.*raw\/([^/]*)/)[1];

    octokit.request(`PATCH /gists/${gistId}`, {
     gist_id: gistId,
     description,
     files: {
      [filename]: {
       filename,
       fileContentString,
      },
     },
    });
   }
  });
 })();
});
