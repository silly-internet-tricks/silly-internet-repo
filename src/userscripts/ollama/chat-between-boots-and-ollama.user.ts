// ==UserScript==
// @name         Chat between BOOTS and OLLAMA
// @namespace    http://tampermonkey.net/
// @version      2025-06-10
// @description  Make the local llm (using ollama) chat with boots
// @author       Josh Parker
// @match        https://www.boot.dev/lessons/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

import chatBetweenXAndSelectedOllamaModel from '../../lib/ollama/chat-between-x-and-selected-ollama-model';
import fillInputElement from '../../lib/util/fill-input-element';

(function chatBetweenBootsAndOllama() {
 const bootsChatSelector = 'textarea[placeholder^=\'Ask Boots\'';
 const sendButtonId = 'silly-internet-tricks-chat-with-boots';
 const sendButton = document.createElement('button');
 sendButton.id = sendButtonId;
 sendButton.addEventListener('click', () => fillInputElement(document.querySelector(bootsChatSelector), '\n'));
 chatBetweenXAndSelectedOllamaModel(
  'div.flex > div.grid',
  {
   textAreaSelector: bootsChatSelector,
   sendButtonSelector: `#${sendButtonId}`,
  },
  (e) => {
   if (e.parentElement.parentElement.classList.contains('flex-row-reverse')) {
    return 'assistant';
   }

   return 'user';
  },
 );
})();
