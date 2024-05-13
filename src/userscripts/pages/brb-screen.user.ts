// ==UserScript==
// @name         BRB screen
// @namespace    http://tampermonkey.net/
// @version      2024-04-25
// @description  Show a BRB page on demand anywhere
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/brb-screen.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/bc25ad5961f1e2e5ffcbab0916943e40/raw/brb-screen.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/bc25ad5961f1e2e5ffcbab0916943e40/raw/brb-screen.meta.js
// ==/UserScript==

import insertCSS from '../../lib/util/insert-css';

(function brbScreen() {
 let isDisplayed = false;

 insertCSS(
  `
div#brb-screen {
 position: fixed;
 inset: 0;
 z-index: 9001;
 overflow: hidden;
 margin: auto;
 background-image: linear-gradient(to right, rgba(0,255,0, 0.1), rgba(255,255,0, 0.1));
}

div#brb-screen h1 {
 margin: auto;
 width: fit-content;
 font-size: 30em;
 padding: 0;
 animation-name: brb;
 animation-iteration-count: infinite;
 animation-duration: 10s;
 
}

@keyframes brb {
 from {
     transform: scale(0.9);
 }

 to {
     transform: scale(1.2);
 }
}
`,
  'brb-screen',
 );

 const brb = document.createElement('div');
 brb.id = 'brb-screen';
 brb.innerHTML = '<h1>BRB</h1>';
 document.body.appendChild(brb);
 brb.style.setProperty('display', 'none');

 document.addEventListener('keypress', ({ code }) => {
  if (code === 'NumpadDivide') {
   if (isDisplayed) {
    brb.style.setProperty('display', 'none');
    isDisplayed = false;
   } else {
    brb.style.setProperty('display', 'block');
    isDisplayed = true;
   }
  }
 });
})();
