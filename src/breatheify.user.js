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

 holdKeyAndClick({
  B: ({ target }) => target.classList.add('breathe-animation'),
  Z: ({ target }) => target.classList.remove('breathe-animation'),
 });
}());
