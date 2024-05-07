// ==UserScript==
// @name         Export HTML
// @namespace    http://tampermonkey.net/
// @version      2024-05-05
// @description  export the page html with cleaned up css
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ollama.com
// @grant        none
// ==/UserScript==

import createOneStyle from '../../lib/util/create-one-style';

(function exportHtml() {
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
