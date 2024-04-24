// ==UserScript==
// @name         breathe-ify
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  add a breathe animation effect to text and/or images!
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        none
// ==/UserScript==

import insertCSS from './insert-css';
import holdKeyAndClick from './hold-key-and-click';

const breatheAnimationClass = 'breathe-animation';

(function breatheify() {
 insertCSS(`
.breathe-animation {
    animation-duration: 3s;
    animation-name: breathe;
    animation-iteration-count: infinite;
}

@keyframes breathe {
    from {
        transform: scale(1.0);
    }

    50% {
        transform: scale(1.1);
    }
    
    to {
        transform: scale(1.0);
    }
}
  `);

 const undoHandler = ({ target }) => {
  if (target) {
   if (target.classList.contains(breatheAnimationClass)) {
    target.classList.remove(breatheAnimationClass);
   } else {
    undoHandler(target.parentNode);
   }
  }
 };

 holdKeyAndClick({
  do: ({ target }) => target.classList.add(breatheAnimationClass),
  undo: undoHandler,
 }, 'breatheify');
}());
