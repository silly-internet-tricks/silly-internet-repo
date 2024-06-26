// ==UserScript==
// @name         Chat between BING and OLLAMA
// @namespace    http://tampermonkey.net/
// @version      2024-04-29
// @description  Make the local llm (using ollama) chat at bing
// @author       Josh Parker
// @match        https://www.bing.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/ollama/chat-between-bing-and-ollama.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/6d6e469a6a76c7b1270120d5db7a0145/raw/chat-between-bing-and-ollama.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/6d6e469a6a76c7b1270120d5db7a0145/raw/chat-between-bing-and-ollama.meta.js
// ==/UserScript==

import chatBetweenXAndSelectedOllamaModel from '../../lib/ollama/chat-between-x-and-selected-ollama-model';

(function chatBetweenChatGptAndOllama() {
 chatBetweenXAndSelectedOllamaModel(
  () =>
   [
    ...document
     .querySelector('cib-serp[mode=conversation]')
     .shadowRoot.querySelector('#cib-conversation-main')
     .shadowRoot.querySelector('cib-chat-turn')
     .shadowRoot.querySelectorAll('cib-message-group'),
   ].map((cmg) => cmg.shadowRoot.querySelector('cib-message')),
  {
   textAreaSelector: () => {
    const actionBar: HTMLElement = document
     .querySelector('cib-serp.cib-serp-main')
     .shadowRoot.querySelector('#cib-action-bar-main');

    return actionBar.shadowRoot
     .querySelector('cib-text-input')
     .shadowRoot.querySelector('textarea#searchbox');
   },
   sendButtonSelector: () => {
    const actionBar: HTMLElement = document
     .querySelector('cib-serp.cib-serp-main')
     .shadowRoot.querySelector('#cib-action-bar-main');

    return actionBar.shadowRoot.querySelector('button[description="Submit"]');
   },
  },
  (e) => {
   const ariaLabel: string = e.getAttribute('aria-label');
   if (ariaLabel.startsWith('Sent by you')) {
    return 'assistant';
   }

   return 'user';
  },
  false,
  (e) => {
   const ariaLabel: string = e.getAttribute('aria-label');
   return ariaLabel.replace(/^Sent by (you|Copilot):/, '');
  },
 );
})();
