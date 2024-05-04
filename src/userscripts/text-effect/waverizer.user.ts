// ==UserScript==
// @name         Waverizer
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  make the text do the wave
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/waverizer.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/cfa5a159cf422ba3ee4b0823e8b9ef54/raw/waverizer.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/cfa5a159cf422ba3ee4b0823e8b9ef54/raw/waverizer.meta.js
// ==/UserScript==

import generalTextEffectifier from '../../lib/effects/general-text-effectifier';
import insertCSS from '../../lib/util/insert-css';

(function waverizer() {
 insertCSS(`span.waverized {
    animation-duration: 3s;
    animation-name: the-wave;
    animation-iteration-count: infinite;
    display: inline-block;
}

@keyframes the-wave {
    from {
        transform: translateY(0);
    }

    2% {
        transform: translateY(-200%);
    }

    4% {
        transform: translateY(0);
    }

    to {
        transform: translateY(0);
    }
}`);

 generalTextEffectifier((text, length) => {
  const letters: string[] = [...text.replace(/^\s+/, ' ').replace(/\s+$/, ' ').replace(/\s+/g, ' ')];
  return letters.map((letter, i) => {
   const span: HTMLElement = document.createElement('span');
   span.classList.add('waverized');
   span.style.setProperty('animation-delay', `${Math.floor((i / length) * 3000)}ms`);
   if (letter === ' ') {
    span.style.setProperty('padding', '0 0.2em');
   }

   span.appendChild(new Text(letter));
   return span;
  });
 }, 'waverizer');
})();
