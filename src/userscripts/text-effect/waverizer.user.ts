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
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/e2b85fa0fdb3349ceef7ec8cb2e3c878/raw/waverizer.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/e2b85fa0fdb3349ceef7ec8cb2e3c878/raw/waverizer.meta.js
// ==/UserScript==

import generalTextEffectifier from '../../lib/effects/general-text-effectifier';
import insertCSS from '../../lib/util/insert-css';
import parameterForm from '../../lib/util/parameter-form';

(function waverizer() {
 const styleSheet = insertCSS(
  `span.waverized {
    animation-duration: 3s;
    animation-name: the-wave;
    animation-iteration-count: infinite;
    display: inline-block;
}

@keyframes the-wave {
    from {
        transform: translateY(0);
    }

    20% {
        transform: translateY(-200%);
    }

    40% {
        transform: translateY(0);
    }

    to {
        transform: translateY(0);
    }
}`,
 );

 let textIndex = 0;

 generalTextEffectifier((text, length) => {
  const letters: string[] = [...text.replace(/^\s+/, ' ').replace(/\s+$/, ' ').replace(/\s+/g, ' ')];
  return letters.map((letter) => {
   const span: HTMLElement = document.createElement('span');
   span.classList.add('waverized');
   span.style.setProperty('animation-delay', `${Math.floor((textIndex / length) * 3000)}ms`);
   textIndex += 1;
   if (letter === ' ') {
    span.style.setProperty('padding', '0 0.2em');
   }

   span.appendChild(new Text(letter));
   return span;
  });
 }, 'waverizer');

 parameterForm(
  'waverizer',
  new Map([['wave-height', { val: 0.0, min: -2.3, max: 2.3, step: 0.1 }]]),
  (_, parameterValue: number) => {
   console.log(parameterValue);
   const percentWaveHeight = 200 * 2 ** parameterValue - 20;
   const cssRules = [...styleSheet.cssRules];
   const keyframesRule = cssRules.find((e) => e instanceof CSSKeyframesRule) as CSSKeyframesRule;

   // @ts-ignore CSSKeyframesRules does seem to spread just fine in this context in chrome (better keep an eye on it I guess)
   const secondKeyframe = [...keyframesRule][1];
   secondKeyframe.style.setProperty('transform', `translateY(-${percentWaveHeight}%)`);
  },
 );
})();
