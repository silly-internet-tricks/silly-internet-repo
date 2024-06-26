// ==UserScript==
// @name         Subscribe Twitch Chat
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Show twitch chat no matter what website you're looking at
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/subscribe-twitch-chat.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/8fbcbdc8cc79be479879ac73c1a2ff65/raw/subscribe-twitch-chat.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/8fbcbdc8cc79be479879ac73c1a2ff65/raw/subscribe-twitch-chat.meta.js
// ==/UserScript==

import insertCSS from '../../lib/util/insert-css';
import getStringFromChunk from '../../lib/util/get-string-from-chunk';

(function subscribeTwitchChat() {
 insertCSS(`
 #twitch-chat {
  position: fixed;
  top: 1dvh;
  left: 1dvw;
  background-color: white;
  padding: 1em;
  border: solid 1px chartreuse;
  border-radius: 3px;
  box-shadow: 1px 2px 3px #4F8F00;
  z-index: 5051;
 }

 #twitch-chat .chat-message {
  color: #9146FF;
 }
 `);

 const chat = document.createElement('div');
 chat.id = 'twitch-chat';
 document.body.appendChild(chat);

 const requestOptions: GmXmlHttpRequestRequestOptions = {
  url: 'http://localhost:9821',
  responseType: 'stream',
  onloadstart: async ({ response }) => {
   // eslint-disable-next-line no-restricted-syntax
   for await (const chunk of response) {
    console.log(chunk);
    const chunkString = getStringFromChunk(chunk);
    console.log(chunkString);
    const chatMessage = document.createElement('p');
    chatMessage.classList.add('chat-message');
    chatMessage.appendChild(new Text(chunkString));
    chat.appendChild(chatMessage);
   }
  },
 };

 GM.xmlHttpRequest(requestOptions);
})();
