// ==UserScript==
// @name         binarizer (bundled version)
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  quickly turn to binary
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// ==/UserScript==

import generalEffectifier from './general-effectifier';

(function binarizer() {
 generalEffectifier((text) => (
  [...text].map((c) => (
   c.charCodeAt(0).toString(2).padStart(8, '0')
  )).join(' ')
 ));
}());
