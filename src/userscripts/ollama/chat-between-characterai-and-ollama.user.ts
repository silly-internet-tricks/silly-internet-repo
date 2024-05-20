// ==UserScript==
// @name         Chat between CHARACTERAI and OLLAMA
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Make the local llm (using ollama) chat at characterai
// @author       Josh Parker
// @match        https://character.ai/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/ollama/chat-between-characterai-and-ollama.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/9565804be42d7e2a442a0d17ff318ef3/raw/chat-between-characterai-and-ollama.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/9565804be42d7e2a442a0d17ff318ef3/raw/chat-between-characterai-and-ollama.meta.js
// ==/UserScript==

import chatBetweenXAndSelectedOllamaModel from '../../lib/ollama/chat-between-x-and-selected-ollama-model';

(function chatBetweenCharacteraiAndOllama() {
 chatBetweenXAndSelectedOllamaModel(
  'div.group.relative [node]',
  {
   textAreaSelector: 'textarea',
   sendButtonSelector: '.text-primary-foreground',
  },
  (e) => {
   if (e?.parentNode?.parentNode?.parentNode?.parentElement?.getAttribute('class')?.match(/items-end/)) {
    return 'assistant';
   }

   return 'user';
  },
  true,
 );
})();
