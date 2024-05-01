// ==UserScript==
// @name         sarcasticizer
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  quickly turn to sarcasm (now bundled to encourage and facilitate code reuse)
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/sarcasticizer.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/52edbd6efc1d3ea14d201e3ab26e8f9f/raw/sarcasticizer.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/52edbd6efc1d3ea14d201e3ab26e8f9f/raw/sarcasticizer.meta.js
// ==/UserScript==

import generalTextEffectifier from '../../lib/effects/general-text-effectifier';

(function sarcasticizer() {
 generalTextEffectifier(
  (text) => [
   new Text([...text].map((c, i) => (i % 2 ? c.toLocaleLowerCase() : c.toLocaleUpperCase())).join('')),
  ],
  'sarcasticizer',
 );
})();
