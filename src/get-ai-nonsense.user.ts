// ==UserScript==
// @name         Get AI nonsense
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Make the local llm (using ollama) tell you some stuff prompted by what you've selected
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

import insertCSS from './insert-css';

(function getAINonsense() {
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

 const ollamaAddress: string = 'http://localhost:11434/';
 const ollamaDiv: HTMLElement = document.createElement('div');
 ollamaDiv.id = 'ollama';
 document.body.appendChild(ollamaDiv);

 let displayOllamaDiv: boolean = true;

 document.addEventListener('keydown', ({ code }) => {
  if (code === 'KeyL') {
   const selectedText: string = window.getSelection().toString();
   console.log(selectedText);

   const requestOptions: GmXmlHttpRequestRequestOptions = {
    url: `${ollamaAddress}api/generate`,
    method: 'POST',
    responseType: 'stream',
    data: JSON.stringify({ model: 'llama3:latest', prompt: selectedText }),
    fetch: true,
    onloadstart: async ({ response }) => {
     // I think this is the idiomatic way to usually handle streams.
     // Next time I'll try it a different way, but I'm ignoring the linter this time
     // eslint-disable-next-line no-restricted-syntax
     for await (const chunk of response) {
      const responseJSON: { response: string } = JSON.parse(
       [...chunk].map((b) => String.fromCharCode(b)).join(''),
      );
      console.log(responseJSON);
      const span: Element = document.createElement('span');
      span.appendChild(new Text(responseJSON.response));
      ollamaDiv.appendChild(span);
     }

     const hr: Element = document.createElement('hr');
     ollamaDiv.appendChild(hr);
    },
   };

   // @ts-expect-error GM is defined as part of the API for the tampermonkey chrome extension
   GM.xmlHttpRequest(requestOptions);
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
})();
