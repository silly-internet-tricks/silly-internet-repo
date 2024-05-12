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
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/get-ai-nonsense.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/00426b084f8089a2cc1c4289e930cede/raw/get-ai-nonsense.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/00426b084f8089a2cc1c4289e930cede/raw/get-ai-nonsense.meta.js
// ==/UserScript==

import insertCSS from '../../lib/util/insert-css';
import getOllamaGeneratedResponse from '../../lib/ollama/get-ollama-generated-response';
import selectOllamaModel from '../../lib/ollama/select-ollama-model';
import divOllamaStyle from '../../lib/ollama/div-ollama-style';

(function getAINonsense() {
 insertCSS(divOllamaStyle);

 const ollamaAddress: string = 'http://localhost:11434/';

 const getModel: () => string = selectOllamaModel(ollamaAddress, 'llama3:latest');

 const ollamaDiv: HTMLElement = document.createElement('div');
 ollamaDiv.id = 'ollama';
 document.body.appendChild(ollamaDiv);

 let displayOllamaDiv: boolean = true;

 document.addEventListener('keydown', async ({ code }) => {
  if (code === 'KeyL') {
   const selectedText: string = window.getSelection().toString();

   await getOllamaGeneratedResponse(ollamaAddress, getModel(), selectedText, (response) => {
    const span: Element = document.createElement('span');
    span.appendChild(new Text(response));
    ollamaDiv.appendChild(span);
   });

   const hr: Element = document.createElement('hr');
   ollamaDiv.appendChild(hr);
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
