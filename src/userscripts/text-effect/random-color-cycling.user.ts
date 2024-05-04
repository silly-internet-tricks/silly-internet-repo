// ==UserScript==
// @name         Random Color Cycling
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  make the text color cycle randomly
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/random-color-cycling.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/cfa5a159cf422ba3ee4b0823e8b9ef54/raw/random-color-cycling.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/cfa5a159cf422ba3ee4b0823e8b9ef54/raw/random-color-cycling.meta.js
// ==/UserScript==

import generalTextEffectifier from '../../lib/effects/general-text-effectifier';
import insertCSS from '../../lib/util/insert-css';

(function randomColorCycling() {
 insertCSS(`span.random-color-cycle {
    animation-name: random-color-cycle;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

@keyframes random-color-cycle {
 0% {
     filter: hue-rotate(0.0turn);
 }
 
 50% {
     filter: hue-rotate(0.5turn);
 }
 
 100% {
     filter: hue-rotate(1.0turn);
 }
}
`);

 generalTextEffectifier((text) => {
  const letters: string[] = [...text.replace(/^\s+/, ' ').replace(/\s+$/, ' ').replace(/\s+/g, ' ')];
  return letters.map((letter) => {
   const span: HTMLElement = document.createElement('span');
   span.classList.add('random-color-cycle');
   span.style.setProperty('animation-duration', `${Math.floor(Math.random() * 15000)}ms`);
   span.style.setProperty(
    'color',
    `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
     Math.random() * 256,
    )})`,
   );
   if (letter === ' ') {
    span.style.setProperty('padding', '0 0.2em');
   }

   span.appendChild(new Text(letter));
   return span;
  });
 }, 'random color cycling');
})();
