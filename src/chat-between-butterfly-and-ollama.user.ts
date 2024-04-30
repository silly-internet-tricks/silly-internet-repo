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
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/chat-between-butterfly-and-ollama.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/658d6cbf776a950fce06f1fa49b2fd58/raw/chat-between-butterfly-and-ollama.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/658d6cbf776a950fce06f1fa49b2fd58/raw/chat-between-butterfly-and-ollama.meta.js
// ==/UserScript==

import chatBetweenXAndOllama from './chat-between-x-and-ollama';

(function chatBetweenChatGptAndOllama() {
 const desiredOllamaModel: string = 'llama3:latest';
 const ollamaAddress: string = 'http://localhost:11434/';
 const chatMessageSelector: string = '[id^="context-menu"]';

 const textAreaSelector: string = '[data-onboarding="send-message"] textarea';
 const sendButtonSelector: string = '[data-onboarding="send-message"] .flex-grow ~ button';

 type RoleCallback = (e: Element) => string;
 const roleCallback: RoleCallback = (e) => {
  if (e.parentElement.parentElement.classList.contains('flex-row-reverse')) {
   return 'assistant';
  }

  return 'user';
 };

 chatBetweenXAndOllama(desiredOllamaModel, ollamaAddress, chatMessageSelector, roleCallback, {
  textAreaSelector,
  sendButtonSelector,
 });
})();
