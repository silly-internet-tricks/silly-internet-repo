// ==UserScript==
// @name         Log Element
// @namespace    http://tampermonkey.net/
// @version      2024-04-30
// @description  just console log the element you select
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/util/log-element.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/bd2feb434101a9a1c0842338b9126e19/raw/log-element.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/bd2feb434101a9a1c0842338b9126e19/raw/log-element.meta.js
// ==/UserScript==

import holdKeyAndClick from '../../lib/util/hold-key-and-click';

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
