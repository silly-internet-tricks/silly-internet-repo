// ==UserScript==
// @name         binarizer
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  quickly turn to binary
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/binarizer.user.js
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/2b11595cc21440fbf74b7e0a3b9e22e0/raw/binarizer.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/2b11595cc21440fbf74b7e0a3b9e22e0/raw/binarizer.meta.js
// ==/UserScript==

import generalEffectifier from './general-effectifier';

(function binarizer() {
 generalEffectifier((text) => (
  [new Text([...text].map((c) => (
   c.charCodeAt(0).toString(2).padStart(8, '0')
  )).join(' '))]
 ), 'binarizer');
}());