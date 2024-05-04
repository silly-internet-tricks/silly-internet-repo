// ==UserScript==
// @name         Rainbow
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  make the text color into a rainbow
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/rainbow.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/e5b900b750adc1b16bd404dd1cc21898/raw/rainbow.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/e5b900b750adc1b16bd404dd1cc21898/raw/rainbow.meta.js
// ==/UserScript==

import generalTextEffectifier from '../../lib/effects/general-text-effectifier';

(function rainbow() {
 let textIndex = 0;

 generalTextEffectifier((text, length) => {
  const letters: string[] = [...text.replace(/^\s+/, ' ').replace(/\s+$/, ' ').replace(/\s+/g, ' ')];
  return letters.map((letter) => {
   const span: HTMLElement = document.createElement('span');
   span.style.setProperty('color', `hsl(${(270 * textIndex) / length}, 100%, 50%)`);

   textIndex += 1;
   if (letter === ' ') {
    span.style.setProperty('padding', '0 0.2em');
   }

   span.appendChild(new Text(letter));
   return span;
  });
 }, 'rainbow');
})();
