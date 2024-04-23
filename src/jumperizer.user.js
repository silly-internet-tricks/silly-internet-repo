// ==UserScript==
// @name         Jumperizer
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  make the text into hyper animated jumping text
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// ==/UserScript==

import generalEffectifier from './general-effectifier';
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

 generalEffectifier((text) => {
  const letters = [...text.replace(/\s+/g, ' ')];
  return letters.map((letter) => {
   const span = document.createElement('span');
   span.classList.add('jumping-bean');
   span.style.setProperty('animation-delay', `${Math.floor(Math.random() * 10000)}ms`);
   if (letter === ' ') {
    span.style.setProperty('padding', '0 0.2em');
   }

   span.appendChild(new Text(letter));
   return span;
  });
 });
}());
