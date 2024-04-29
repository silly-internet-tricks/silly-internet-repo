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

import chatBetweenXAndOllama from './chat-between-x-and-ollama';

(function chatBetweenClaudeAndOllama() {
 const desiredOllamaModel: string = 'llama3:latest';
 const ollamaAddress: string = 'http://localhost:11434/';
 const chatMessageSelector: string = '[class*="message"]';

 chatBetweenXAndOllama(
  desiredOllamaModel,
  ollamaAddress,
  chatMessageSelector,
  (e) => {
   if (e.getAttribute('class').match(/user/)) {
    return 'assistant';
   }

   return 'user';
  },
 );
})();
