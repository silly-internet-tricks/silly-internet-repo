// ==UserScript==
// @name         fidget text
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  make the text fidgety
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/fidget-text.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/cfa5a159cf422ba3ee4b0823e8b9ef54/raw/fidget-text.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/cfa5a159cf422ba3ee4b0823e8b9ef54/raw/fidget-text.meta.js
// ==/UserScript==

import generalTextEffectifier from '../../lib/effects/general-text-effectifier';
import insertCSS from '../../lib/util/insert-css';

(function fidgetText() {
 insertCSS(`span.fidget-text {
    animation-name: fidget-text;
    animation-iteration-count: infinite;
    display: inline-block;
}

@keyframes fidget-text {
    from {
        transform: rotate(0.0turn);
    }

    2% {
        transform: rotate(-2.0turn);
    }

    4% {
        transform: rotate(-2.0turn);
    }

    to {
        transform: rotate(-2.0turn);
    }
}`);

 generalTextEffectifier((text) => {
  const letters: string[] = [...text.replace(/^\s+/, ' ').replace(/\s+$/, ' ').replace(/\s+/g, ' ')];
  return letters.map((letter) => {
   const span: HTMLElement = document.createElement('span');
   span.classList.add('fidget-text');
   span.style.setProperty('animation-delay', `${Math.floor(Math.random() * 30000)}ms`);
   span.style.setProperty('animation-duration', `${Math.floor(Math.random() * 30000)}ms`);
   if (letter === ' ') {
    span.style.setProperty('padding', '0 0.2em');
   }

   span.appendChild(new Text(letter));
   return span;
  });
 }, 'fidget text');
})();
