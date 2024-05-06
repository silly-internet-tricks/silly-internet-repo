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
   const style = createOneStyle();
   document.querySelectorAll('style').forEach((s) => {
    s.parentNode.removeChild(s);
   });

   document.head.appendChild(style);

   console.log(document.body.parentElement.outerHTML);
  }
 });
})();
