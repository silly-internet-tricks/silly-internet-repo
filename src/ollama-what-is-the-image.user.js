// ==UserScript==
// @name         ollama what is the image
// @namespace    http://tampermonkey.net/
// @version      2024-04-27
// @description  ask the ollama model to identify the image
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/*
// @match        https://tvtropes.org/pmwiki/pmwiki.php/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      static.tvtropes.org
// @connect      upload.wikimedia.org
// ==/UserScript==

import insertCSS from './insert-css';

(function ollamaWhatIsTheImage() {
 // TODO: This is copy-pasted from get ai nonsense, so consider moving to its own file
 insertCSS(`
  div#ollama {
    position: fixed;
    inset: 0;
    color: chartreuse;
    background-color: black;
    height: fit-content;
    z-index: 70;
    padding: 1%;
    font-family: monospace;
    max-height: 30dvh;
    overflow: auto;
}
  `);

 const ollamaAddress = 'http://localhost:11434/';
 const ollamaDiv = document.createElement('div');

 const ollamaModel = 'llava:latest';

 ollamaDiv.id = 'ollama';
 document.body.appendChild(ollamaDiv);

 let displayOllamaDiv = true;

 const clickEventListener = function clickEventListener(event) {
  console.log(event);
  event.preventDefault();
  event.stopPropagation();
  const { target } = event;
  console.log(target);
  console.log(target.tagName);
  // note: be cautious with the capitalization on tagName
  if (target.tagName.toLocaleLowerCase() === 'img') {
   console.log(target.src);
   GM.xmlHttpRequest({ url: target.src, responseType: 'arraybuffer' })
    .then((r) => {
     const base64Image = btoa([...(new Uint8Array(r.response))].map((b) => String.fromCharCode(b)).join(''));
     GM.xmlHttpRequest({
      url: `${ollamaAddress}api/generate`,
      method: 'POST',
      responseType: 'stream',
      data: JSON.stringify({ model: ollamaModel, prompt: '"What is in this picture?"', images: [base64Image] }),
      fetch: true,
      onloadstart: async ({ response }) => {
       // I think this is the idiomatic way to usually handle streams.
       // Next time I'll try it a different way, but I'm ignoring the linter this time
       // eslint-disable-next-line no-restricted-syntax
       for await (const chunk of response) {
        const responseJSON = JSON.parse([...chunk].map((b) => String.fromCharCode(b)).join(''));
        console.log(responseJSON);
        const span = document.createElement('span');
        span.appendChild(new Text(responseJSON.response));
        ollamaDiv.appendChild(span);
       }

       const hr = document.createElement('hr');
       ollamaDiv.appendChild(hr);
      },
     });
    });
  }
 };

 document.addEventListener('keydown', ({ code }) => {
  if (code === 'KeyL') {
   // document.addEventListener('click', clickEventListener);
   document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('click', clickEventListener);
   });
  } else if (code === 'KeyH') {
   if (displayOllamaDiv) {
    ollamaDiv.style.setProperty('display', 'none');
    displayOllamaDiv = false;
   } else {
    ollamaDiv.style.setProperty('display', 'block');
    displayOllamaDiv = true;
   }
  }
 });

 document.addEventListener('keyup', ({ code }) => {
  if (code === 'KeyL') {
   // document.removeEventListener('click', clickEventListener);
   document.querySelectorAll('img').forEach((img) => {
    img.removeEventListener('click', clickEventListener);
   });
  }
 });
}());
