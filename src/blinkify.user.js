// ==UserScript==
// @name         blink-ify
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  add a classic blink element esque animation effect to text and/or images!
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/blinkify.user.js
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/d09ec1d4d6cd4f1077841bd83e9e1918/raw/blinkify.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/d09ec1d4d6cd4f1077841bd83e9e1918/raw/blinkify.meta.js
// ==/UserScript==

import generalAnimationifier from './general-animation-ifier';

const blinkAnimationClass = 'blink-animation';

(function blinkify() {
 generalAnimationifier(blinkAnimationClass, `
 .${blinkAnimationClass} {
     animation-duration: 1s;
     animation-name: blink;
     animation-iteration-count: infinite;
 }
 
 @keyframes blink {
     from {
         opacity: 1.0;
     }
 
     50% {
         opacity: 1.0;
     }

     51% {
         opacity: 0.0;
     }
     
     to {
         opacity: 0.0;
     }
 }
   `, 'blinkify');
}());
