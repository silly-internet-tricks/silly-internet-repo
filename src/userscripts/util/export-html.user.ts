// ==UserScript==
// @name         Export HTML
// @namespace    http://tampermonkey.net/
// @version      2024-05-05
// @description  export the page html with cleaned up css
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ollama.com
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/util/export-html.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/77acb464b4d9fd6d07ca79ca0ea57f5c/raw/export-html.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/77acb464b4d9fd6d07ca79ca0ea57f5c/raw/export-html.meta.js
// ==/UserScript==

import createOneStyle from '../../lib/util/create-one-style';

(function exportHtml() {
 // TODO: find out the cause of the error when running it on this page: https://developer.mozilla.org/en-US/docs/Web/CSS/:modal
 document.addEventListener('keypress', ({ code }) => {
  if (code === 'KeyM') {
   // TODO: think on this: how do we want to configure these special exceptions?
   document.querySelectorAll('#effect-keys-menu,#ollama-model').forEach((s) => {
    s.parentNode.removeChild(s);
   });

   const style = createOneStyle();
   document.querySelectorAll('style,script,body meta,body title').forEach((s) => {
    s.parentNode.removeChild(s);
   });

   document.querySelectorAll('[style]').forEach((e) => {
    e.removeAttribute('style');
   });

   document.head.appendChild(style);

   navigator.clipboard.writeText(document.body.parentElement.outerHTML);
  }
 });
})();
