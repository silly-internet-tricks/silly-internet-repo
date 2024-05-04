// ==UserScript==
// @name         propeller
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  add a zany and whimsical propeller animation effect to text and/or images!
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/breatheify.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/d09ec1d4d6cd4f1077841bd83e9e1918/raw/breatheify.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/d09ec1d4d6cd4f1077841bd83e9e1918/raw/breatheify.meta.js
// ==/UserScript==

import generalAnimationifier from '../../lib/effects/general-animation-ifier';

const propellerAnimationClass: string = 'propeller-animation';

(function propeller() {
 generalAnimationifier(
  propellerAnimationClass,
  `
 .${propellerAnimationClass} {
     animation-duration: 1s;
     animation-name: propeller;
     animation-iteration-count: infinite;
     animation-timing-function: linear;
 }
 
 @keyframes propeller {
     from {
         transform: rotate(0.0turn);
     }
 
     50% {
         transform: rotate(0.5turn);
     }
     
     to {
         transform: rotate(1.0turn);
     }
 }
   `,
  'propeller',
 );
})();
