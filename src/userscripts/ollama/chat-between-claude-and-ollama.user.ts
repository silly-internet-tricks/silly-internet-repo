// ==UserScript==
// @name         Chat between CLAUDE and OLLAMA
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Make the local llm (using ollama) chat at anthropic claude
// @author       Josh Parker
// @match        https://claude.ai/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/chat-between-claude-and-ollama.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/cfa02f54a7ef2209be3584cd51e89bfc/raw/chat-between-claude-and-ollama.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/cfa02f54a7ef2209be3584cd51e89bfc/raw/chat-between-claude-and-ollama.meta.js
// ==/UserScript==

import chatBetweenXAndSelectedOllamaModel from '../../lib/ollama/chat-between-x-and-selected-ollama-model';
import insertCSS from '../../lib/util/insert-css';

(function chatBetweenClaudeAndOllama() {
 insertCSS(`
.pt-12 {
 margin-left: 10dvw;
}
`);

 chatBetweenXAndSelectedOllamaModel(
  '[class*="message"]',
  {
   textAreaSelector: (s) => {
    document.querySelector('[contenteditable] > p').textContent += s;
   },
   sendButtonSelector: 'button[aria-label="Send Message"]',
  },
  (e) => {
   if (e.getAttribute('class').match(/user/)) {
    return 'assistant';
   }

   return 'user';
  },
 );
})();
