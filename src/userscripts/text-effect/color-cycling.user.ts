// ==UserScript==
// @name         color cycle
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  add a color-cycling animation effect to text and/or images!
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        unsafeWindow
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/text-effect/color-cycling.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/afcf88326de111771a22335808873726/raw/color-cycling.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/afcf88326de111771a22335808873726/raw/color-cycling.meta.js
// ==/UserScript==

import generalAnimationifier from '../../lib/effects/general-animation-ifier';

const colorCyclingClass: string = 'color-cycling';

(function colorCycling() {
 generalAnimationifier(
  colorCyclingClass,
  `
 .${colorCyclingClass} {
     color: hsl(0, 100%, 50%);
     animation-duration: 6s;
     animation-name: color-cycle;
     animation-iteration-count: infinite;
     animation-timing-function: linear;
 }
 
 @keyframes color-cycle {
     from {
         filter: hue-rotate(-0.0turn);
     }
     
     to {
         filter: hue-rotate(-1.0turn);
     }
 }
   `,
  'color cycle',
 );
})();
