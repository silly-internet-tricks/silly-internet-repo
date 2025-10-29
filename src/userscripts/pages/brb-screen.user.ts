// ==UserScript==
// @name         BRB screen
// @namespace    http://tampermonkey.net/
// @version      2024-04-25
// @description  Show a BRB page on demand anywhere
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/pages/brb-screen.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/bc25ad5961f1e2e5ffcbab0916943e40/raw/brb-screen.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/bc25ad5961f1e2e5ffcbab0916943e40/raw/brb-screen.meta.js
// ==/UserScript==

import insertCSS from '../../lib/util/insert-css';

(function brbScreen() {
 let isDisplayed = false;
 const brb = document.createElement('div');
 brb.id = 'brb-screen';
 const h1 = document.createElement('h1');
 h1.appendChild(new Text('BRB'));
 brb.appendChild(h1);

 document.addEventListener('keypress', ({ code }) => {
  if (code === 'NumpadDivide') {
   if (isDisplayed) {
    brb.parentElement.removeChild(brb);
    isDisplayed = false;
   } else {
    document.body.appendChild(brb);
    isDisplayed = true;
   }
  }
 });

 insertCSS(
  `div#brb-screen {
 position: fixed;
 inset: 0;
 z-index: 1000000;
 overflow: hidden;
 margin: auto;
 background-image: linear-gradient(to right, rgba(0,255,0, 0.1), rgba(255,255,0, 0.1));
 animation-name: brb-color-cycle;
 animation-iteration-count: infinite;
 animation-duration: 8s;
 animation-timing-function: linear;
 text-shadow: 0 0 10px hsl(var(--hue), 100%, 100%),
              0 0 20px hsl(var(--hue), 100%, 87%),
              0 0 30px hsl(var(--hue), 100%, 81%),
              0 0 40px hsl(var(--hue), 100%, 75%),
              0 0 50px hsl(var(--hue), 100%, 69%),
              0 0 60px hsl(var(--hue), 100%, 62%);
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

@keyframes brb-color-cycle {
    from {
        --hue: 0;
    }

    to {
        --hue: 360;
    }
}

@keyframes brb {
 from {
     transform: scale(0.9);
 }

 to {
     transform: scale(1.2);
 }
}


@property --hue {
    syntax: "<number>";
    inherits: false;
    initial-value: 0;
  }
`,
 );
})();
