// ==UserScript==
// @name         Show Twitch Chat
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Show twitch chat no matter what website you're looking at (no external dependencies)
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/toast-twitch-chat.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/9b6d4a20dcf00cddd53ac1392aabc5f0/raw/toast-twitch-chat.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/9b6d4a20dcf00cddd53ac1392aabc5f0/raw/toast-twitch-chat.meta.js
// @noframes
// ==/UserScript==

import getStringFromChunk from '../../lib/util/get-string-from-chunk';
import insertCSS from '../../lib/util/insert-css';
import observeElementRemovalAndReaddIt from '../../lib/util/observe-element-removal-and-readd-it';

// TODO: try showing emotes as mentioned at https://dev.twitch.tv/docs/irc/emotes/#getting-channel-emotes
(function subscribeTwitchChat() {
 const showChat = (function makeShowChat() {
  const chatModal = document.createElement('div');
  const chatModalUl = document.createElement('ul');
  chatModal.appendChild(chatModalUl);
  let timeoutNumber: NodeJS.Timeout;
  return function showChatFunction(chat: string) {
   const chatLi = document.createElement('li');
   chatLi.appendChild(new Text(chat));

   chatModalUl.appendChild(chatLi);

   document.body.appendChild(chatModal);
   chatModal.classList.remove('twitch-chat-modal');
   chatModal.classList.add('twitch-chat-modal');
   clearTimeout(timeoutNumber);
   timeoutNumber = setTimeout(() => {
    chatModal.classList.remove('twitch-chat-modal');
    chatModal.parentElement.removeChild(chatModal);
   }, 5000);

   setTimeout(() => chatLi.parentElement.removeChild(chatLi), 5000);
  };
 })();

 const emptyElementId = 'toast-twitch-chat-empty-element';

 insertCSS(`
  .twitch-chat-toast {
    z-index: 9001;
  }

  #${emptyElementId} {
    z-index: 9001;
  }

  .twitch-chat-modal {
   position: fixed;
   top: 2px;
   left: 2px;
   font-size: 2rem;
   z-index: 102;
   background-image: linear-gradient(
    to top, #3FFF00 var(--gradient-bottom),
    #FFBF00 var(--gradient-top)
  );

   padding: 0.5rem;
   box-shadow: 2px 2px 2px black;
   text-shadow: 1px 1px 1px magenta;
   animation-name: modal-fade-out;
   animation-duration: 5s;
   animation-timing-function: linear;
   animation-iteration-count: 1;
}

@keyframes modal-fade-out {
 0% {
  opacity: 100%;
  --gradient-top: 0%;
  --gradient-bottom: 0%;
 }

 25% {
  opacity: 100%;
  --gradient-top: 100%;
  --gradient-bottom: 0%;
 }

 50% {
  opacity: 100%;
  --gradient-top: 100%;
  --gradient-bottom: 100%;
 }

 100% {
  opacity: 0%;
  --gradient-top: 100%;
  --gradient-bottom: 100%;
 }
}

@property --gradient-top {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

@property --gradient-bottom {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}
  `);

 const emptyElement = document.createElement('div');
 emptyElement.id = emptyElementId;
 document.body.appendChild(emptyElement);
 observeElementRemovalAndReaddIt(emptyElement);

 const requestOptions: GmXmlHttpRequestRequestOptions = {
  url: 'http://localhost:9821',
  responseType: 'stream',
  onloadstart: async ({ response }) => {
   // eslint-disable-next-line no-restricted-syntax
   for await (const chunk of response) {
    const chunkString = getStringFromChunk(chunk);
    console.log(chunkString);
    showChat(chunkString);
   }
  },
 };

 GM.xmlHttpRequest(requestOptions);
})();
