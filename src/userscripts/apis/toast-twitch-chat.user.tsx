// ==UserScript==
// @name         Toast Twitch Chat
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Show twitch chat no matter what website you're looking at (using react toastify)
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/toast-twitch-chat.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/toast-twitch-chat.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/toast-twitch-chat.meta.js
// ==/UserScript==

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getStringFromChunk from '../../lib/util/get-string-from-chunk';
import findEmptyElement from '../../lib/util/find-empty-element';
import insertCSS from '../../lib/util/insert-css';

(function subscribeTwitchChat() {
 insertCSS(`
  .twitch-chat-toast {
    z-index: 9001;
  }
  `);

 const App = function App() {
  return (
   <div id="toast-twitch-chat-userscript">
    <ToastContainer />
   </div>
  );
 };

 const emptyElement = findEmptyElement();
 emptyElement.style.setProperty('z-index', '9001');
 const root = createRoot(emptyElement);

 root.render(<App />);

 const requestOptions: GmXmlHttpRequestRequestOptions = {
  url: 'http://localhost:9821',
  responseType: 'stream',
  onloadstart: async ({ response }) => {
   // eslint-disable-next-line no-restricted-syntax
   for await (const chunk of response) {
    const chunkString = getStringFromChunk(chunk);
    console.log(chunkString);
    toast(chunkString, {
     className: 'twitch-chat-toast',
    });
   }
  },
 };

 // @ts-expect-error GM is defined as part of the API for the tampermonkey chrome extension
 GM.xmlHttpRequest(requestOptions);
})();
