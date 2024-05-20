// ==UserScript==
// @name         Chat between BUTTERFLY and OLLAMA
// @namespace    http://tampermonkey.net/
// @version      2024-04-29
// @description  Make the local llm (using ollama) chat at butterfly
// @author       Josh Parker
// @match        https://www.butterflies.ai/messages/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/ollama/chat-between-butterfly-and-ollama.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/658d6cbf776a950fce06f1fa49b2fd58/raw/chat-between-butterfly-and-ollama.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/658d6cbf776a950fce06f1fa49b2fd58/raw/chat-between-butterfly-and-ollama.meta.js
// ==/UserScript==

import chatBetweenXAndSelectedOllamaModel from '../../lib/ollama/chat-between-x-and-selected-ollama-model';

(function chatBetweenChatGptAndOllama() {
 chatBetweenXAndSelectedOllamaModel(
  '[id^="context-menu"]',
  {
   textAreaSelector: '[data-onboarding="send-message"] textarea',
   sendButtonSelector: '[data-onboarding="send-message"] .flex-grow ~ button',
  },
  (e) => {
   if (e.parentElement.parentElement.classList.contains('flex-row-reverse')) {
    return 'assistant';
   }

   return 'user';
  },
 );
})();
