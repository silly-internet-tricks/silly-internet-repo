// ==UserScript==
// @name         Sliding BG Block
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  add a sliding bg block animation effect
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/text-effect/sliding-bg-block.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/002bc33024e0c79337af7d18e0cf81eb/raw/sliding-bg-block.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/002bc33024e0c79337af7d18e0cf81eb/raw/sliding-bg-block.meta.js
// ==/UserScript==

import generalAnimationifier from '../../lib/effects/general-animation-ifier';

const slidingBgBlockAnimationClass: string = 'sliding-bg-block-animation';

(function slidingBgBlock() {
 // see here for the @property syntax for defining the css custom property
 // https://stackoverflow.com/a/63674883
 generalAnimationifier(
  slidingBgBlockAnimationClass,
  `
 .${slidingBgBlockAnimationClass} {
     animation-duration: 3s;
     animation-name: sliding-bg-block;
     animation-iteration-count: infinite;
     animation-timing-function: linear;
     background-image: linear-gradient(to right, rgba(255,255,255,0.0) var(--slide), red var(--slide), red calc(var(--slide) + 20%), rgba(255,255,255, 0.0) calc(var(--slide) + 20%));
 }
 
 @keyframes sliding-bg-block {
     from {
      --slide: 100%;
     }
     
     to {
      --slide: -20%;
     }
 }

 @property --slide {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
   `,
  'sliding-bg-block',
 );
})();
