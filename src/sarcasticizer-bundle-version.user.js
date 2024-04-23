// ==UserScript==
// @name         sarcasticizer (bundled)
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  quickly turn to sarcasm (now bundled to encourage and facilitate code reuse)
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// ==/UserScript==

import generalEffectifier from './general-effectifier';

(function sarcasticizer() {
 generalEffectifier((text) => (
  [new Text([...text].map((c, i) => (
   i % 2 ? c.toLocaleLowerCase() : c.toLocaleUpperCase()
  )).join(''))]
 ));
}());
