// ==UserScript==
// @name         Chat between CHAT GPT and OLLAMA
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Make the local llm (using ollama) chat at chat gpt
// @author       Josh Parker
// @match        https://chat.openai.com/
// @match        https://chatgpt.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/ollama/chat-between-chatgpt-and-ollama.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/25a8aa0997fe06984d5a9947c18583b1/raw/chat-between-chatgpt-and-ollama.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/25a8aa0997fe06984d5a9947c18583b1/raw/chat-between-chatgpt-and-ollama.meta.js
// ==/UserScript==

import chatBetweenXAndSelectedOllamaModel from '../../lib/ollama/chat-between-x-and-selected-ollama-model';

(function chatBetweenChatGptAndOllama() {
 chatBetweenXAndSelectedOllamaModel(
  '[data-message-author-role]',
  {
   textAreaSelector: '#prompt-textarea',
   sendButtonSelector: '[data-testid="send-button"]',
  },
  (e) => {
   if (e.getAttribute('data-message-author-role') === 'user') {
    return 'assistant';
   }

   return 'user';
  },
  undefined,
  undefined,
  (e, msg) => {
      const p = document.createElement('p');
      p.textContent = msg;
      e.appendChild(p);
  },
 );
})();
