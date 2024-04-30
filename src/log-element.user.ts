// ==UserScript==
// @name         Log Element
// @namespace    http://tampermonkey.net/
// @version      2024-04-30
// @description  just console log the element you select
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// ==/UserScript==

import holdKeyAndClick from './hold-key-and-click';

(function logElement() {
 holdKeyAndClick(
  ['l', 'o', 'g'],
  (event) => {
   event.preventDefault();
   console.log(event.target);
  },
  'log',
 );
})();
