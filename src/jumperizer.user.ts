// ==UserScript==
// @name         Jumperizer
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  make the text into hyper animated jumping text
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/jumperizer.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/cfa5a159cf422ba3ee4b0823e8b9ef54/raw/jumperizer.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/cfa5a159cf422ba3ee4b0823e8b9ef54/raw/jumperizer.meta.js
// ==/UserScript==

import generalTextEffectifier from './general-text-effectifier';
import insertCSS from './insert-css';

(function jumperizer() {
 insertCSS(`span.jumping-bean {
    animation-duration: 10s;
    animation-name: jumper;
    animation-iteration-count: infinite;
    display: inline-block;
}

@keyframes jumper {
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

 generalTextEffectifier((text) => {
  const letters: string[] = [...text.trim().replace(/\s+/g, ' ')];
  return letters.map((letter) => {
   const span: HTMLElement = document.createElement('span');
   span.classList.add('jumping-bean');
   span.style.setProperty('animation-delay', `${Math.floor(Math.random() * 10000)}ms`);
   if (letter === ' ') {
    span.style.setProperty('padding', '0 0.2em');
   }

   span.appendChild(new Text(letter));
   return span;
  });
 }, 'jumperizer');
}());
