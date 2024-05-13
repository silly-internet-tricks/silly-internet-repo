// ==UserScript==
// @name         wiggle grow
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  make the text into wiggling-type growing text
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/wiggle-grow.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/d269d9eae99e4971b46bd125fa3fe96b/raw/wiggle-grow.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/d269d9eae99e4971b46bd125fa3fe96b/raw/wiggle-grow.meta.js
// ==/UserScript==

import generalTextEffectifier from '../../lib/effects/general-text-effectifier';
import insertCSS from '../../lib/util/insert-css';

(function jumperizer() {
 insertCSS(`span.wiggler-grower {
    animation-name: wiggle-grow;
    animation-iteration-count: infinite;
    display: inline-block;
}

@keyframes wiggle-grow {
    from {
        font-size: 100%;
    }

    50% {
     font-size: 200%;
    }

    to {
     font-size: 100%;
    }
}`);

 generalTextEffectifier((text) => {
  const letters: string[] = [...text.replace(/^\s+/, ' ').replace(/\s+$/, ' ').replace(/\s+/g, ' ')];
  return letters.map((letter) => {
   const span: HTMLElement = document.createElement('span');
   span.classList.add('wiggler-grower');
   span.style.setProperty('animation-delay', `${Math.floor(Math.random() * 10000)}ms`);
   span.style.setProperty('animation-duration', `${Math.floor(Math.random() * 10000)}ms`);
   if (letter === ' ') {
    span.style.setProperty('padding', '0 0.2em');
   }

   span.appendChild(new Text(letter));
   return span;
  });
 }, 'wiggle grow');
})();
