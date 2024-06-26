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
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/ollama/ollama-what-is-the-image.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/959735549921e3bfe249c19f58900e82/raw/ollama-what-is-the-image.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/959735549921e3bfe249c19f58900e82/raw/ollama-what-is-the-image.meta.js
// ==/UserScript==

import insertCSS from '../../lib/util/insert-css';
import getStringFromChunk from '../../lib/util/get-string-from-chunk';
import divOllamaStyle from '../../lib/ollama/div-ollama-style';
import bufferToBase64 from '../../lib/util/buffer-to-base64';

(function ollamaWhatIsTheImage() {
 insertCSS(divOllamaStyle);

 const ollamaAddress: string = 'http://localhost:11434/';
 const ollamaDiv: HTMLElement = document.createElement('div');

 const ollamaModel: string = 'llava:latest';

 ollamaDiv.id = 'ollama';
 document.body.appendChild(ollamaDiv);

 let displayOllamaDiv: boolean = true;

 const clickEventListener: (event: Event) => void = function clickEventListener(event) {
  event.preventDefault();
  event.stopPropagation();
  const { target } = event;
  const element: Element = target as Element;
  if (!element.tagName) {
   throw new Error(`expected the event target ${element} to be an Element with a tagName`);
  }

  // note: be cautious with the capitalization on tagName
  if (element.tagName.toLocaleLowerCase() === 'img') {
   const imgElement: HTMLImageElement = element as HTMLImageElement;

   const imageRequestOptions: GmXmlHttpRequestRequestOptions = {
    url: imgElement.src,
    responseType: 'arraybuffer',
   };

   GM.xmlHttpRequest(imageRequestOptions).then((r: GmXmlHttpRequestResponse) => {
    const base64Image: string = bufferToBase64(r.response);

    const requestOptions: GmXmlHttpRequestRequestOptions = {
     url: `${ollamaAddress}api/generate`,
     method: 'POST',
     responseType: 'stream',
     data: JSON.stringify({
      model: ollamaModel,
      prompt: '"What is in this picture?"',
      images: [base64Image],
     }),
     fetch: true,
     onloadstart: async ({ response }) => {
      // I think this is the idiomatic way to usually handle streams.
      // Next time I'll try it a different way, but I'm ignoring the linter this time
      // eslint-disable-next-line no-restricted-syntax
      for await (const chunk of response) {
       const responseJSON: { response: string } = JSON.parse(getStringFromChunk(chunk));

       const span: Element = document.createElement('span');
       span.appendChild(new Text(responseJSON.response));
       ollamaDiv.appendChild(span);
      }

      const hr: Element = document.createElement('hr');
      ollamaDiv.appendChild(hr);
     },
    };

    GM.xmlHttpRequest(requestOptions);
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
})();
