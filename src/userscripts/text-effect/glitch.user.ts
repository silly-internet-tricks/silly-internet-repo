// ==UserScript==
// @name         Glitch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  animated glitch effect on the element you select
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        unsafeWindow
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/text-effect/glitch.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/a264ce6c2e4640d1348fe5ea59f3e0e0/raw/glitch.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/a264ce6c2e4640d1348fe5ea59f3e0e0/raw/glitch.meta.js
// ==/UserScript==
import generalAnimationifier from '../../lib/effects/general-animation-ifier';
import glitchSvg from '../../lib/effects/effect-util/glitch-svg';
import parameterForm from '../../lib/util/parameter-form';

const glitchAnimationClass: string = 'glitch-animation';
const glitchFilterId: string = 'glitch-filter';

(function glitchify() {
 console.log('starting glitchify');
 // TODO: use a form to control the effect parameters in real time.

 const filter = document.createElement('div');
 filter.style.setProperty('position', 'fixed');
 filter.style.setProperty('width', '101dvw');
 filter.style.setProperty('height', '101dvh');
 filter.style.setProperty('z-index', '-1');

 const { svg, changeGlitchSpeed } = glitchSvg(30, glitchFilterId);
 filter.innerHTML = svg;
 parameterForm(
  'glitch',
  new Map([['glitch-speed', { val: 0.0, min: -3.3, max: 3.3, step: 0.1 }]]),
  (parameterLabel, parameterValue: number) => {
   // when we add more parameters into the callback, we'll need to use the parameterLabel
   changeGlitchSpeed(2.0 ** parameterValue);
  },
 );

 const body = document.querySelector('body');
 body.appendChild(filter);

 generalAnimationifier(
  glitchAnimationClass,
  `
 .${glitchAnimationClass} {
     filter: url(#${glitchFilterId});
     transform: translate(-29px, -29px);
 }
   `,
  'glitch',
 );
})();
