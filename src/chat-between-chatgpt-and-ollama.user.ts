// ==UserScript==
// @name         Chat between CHAT GPT and OLLAMA
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Make the local llm (using ollama) chat at chat gpt
// @author       Josh Parker
// @match        https://chat.openai.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/chat-between-chatgpt-and-ollama.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/25a8aa0997fe06984d5a9947c18583b1/raw/chat-between-chatgpt-and-ollama.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/25a8aa0997fe06984d5a9947c18583b1/raw/chat-between-chatgpt-and-ollama.meta.js
// ==/UserScript==

import chatBetweenXAndOllama from './chat-between-x-and-ollama';

(function chatBetweenChatGptAndOllama() {
 const desiredOllamaModel: string = 'llama3:latest';
 const ollamaAddress: string = 'http://localhost:11434/';
 const chatMessageSelector: string = '[data-message-author-role]';
 type RoleCallback = (e: Element) => string;
 const roleCallback: RoleCallback = (e) => {
  if (e.getAttribute('data-message-author-role') === 'user') {
   return 'assistant';
  }

  return 'user';
 };

 chatBetweenXAndOllama(desiredOllamaModel, ollamaAddress, chatMessageSelector, roleCallback);
})();
