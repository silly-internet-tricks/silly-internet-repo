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

import insertCSS from './insert-css';

(function chatBetweenChatGptAndOllama() {
 insertCSS(`
#ollama-text {
 position: fixed;
 bottom: 10px;
 left: 10px;
 border: solid chartreuse 8px;
 border-radius: 8px;
 padding: 20px;
 background-color: rgba(255,0,127,0.2);
 max-width: 30dvw;
 overflow-y: auto;
}
`);

 const desiredOllamaModel: string = 'llama3:latest';
 const ollamaAddress: string = 'http://localhost:11434/';
 const ollamaText: Element = document.createElement('div');
 ollamaText.id = 'ollama-text';
 const ollamaButton: Element = document.createElement('button');
 ollamaButton.appendChild(new Text('ask ollama'));
 ollamaText.appendChild(ollamaButton);
 document.body.appendChild(ollamaText);
 ollamaButton.addEventListener('click', () => {
  const chatMessages: Element[] = [...document.querySelectorAll('[data-message-author-role]')];

  const requestOptions: GmXmlHttpRequestRequestOptions = {
   url: `${ollamaAddress}api/chat`,
   method: 'POST',
   responseType: 'stream',
   data: JSON.stringify({
    model: desiredOllamaModel,
    messages: chatMessages.map((e) => ({
     role: e.getAttribute('data-message-author-role') === 'user' ? 'assistant' : 'user',
     content: e.textContent,
    })),
   }),
   fetch: true,
   onloadstart: async ({ response }) => {
    const responseParagraph: Element = document.createElement('p');
    ollamaText.appendChild(responseParagraph);
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of response) {
     interface OllamaChatApiResponseJson {
      message: {
       content: string;
      };
     }

     const responseJSON: OllamaChatApiResponseJson = JSON.parse(
      [...chunk].map((b) => String.fromCharCode(b)).join(''),
     );

     const span: Element = document.createElement('span');

     span.appendChild(new Text(responseJSON.message.content));
     responseParagraph.appendChild(span);
    }
   },
  };

  // @ts-expect-error GM is defined as part of the API for the tampermonkey chrome extension
  GM.xmlHttpRequest(requestOptions);
 });
})();
