// ==UserScript==
// @name         breathe-ify
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  add a breathe animation effect to text and/or images!
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/breatheify.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/d09ec1d4d6cd4f1077841bd83e9e1918/raw/breatheify.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/d09ec1d4d6cd4f1077841bd83e9e1918/raw/breatheify.meta.js
// ==/UserScript==

import generalAnimationifier from './general-animation-ifier';

const breatheAnimationClass: string = 'breathe-animation';

(function breatheify() {
 generalAnimationifier(
  breatheAnimationClass,
  `
 .${breatheAnimationClass} {
     animation-duration: 3s;
     animation-name: breathe;
     animation-iteration-count: infinite;
 }
 
 @keyframes breathe {
     from {
         transform: scale(1.0);
     }
 
     50% {
         transform: scale(1.1);
     }
     
     to {
         transform: scale(1.0);
     }
 }
   `,
  'breatheify',
 );
})();
