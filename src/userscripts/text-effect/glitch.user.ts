// ==UserScript==
// @name         Glitch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  animated glitch effect on the element you select
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// ==/UserScript==
import generalAnimationifier from '../../lib/effects/general-animation-ifier';
import glitchSvg from '../../lib/effects/effect-util/glitch-svg';

const glitchAnimationClass: string = 'glitch-animation';
const glitchFilterId: string = 'glitch-filter';

(function glitchify() {
 const filter = document.createElement('div');
 filter.style.setProperty('position', 'fixed');
 filter.style.setProperty('width', '101dvw');
 filter.style.setProperty('height', '101dvh');

 filter.innerHTML = glitchSvg(30, glitchFilterId);

 const body = document.querySelector('body');
 body.appendChild(filter);

 generalAnimationifier(
  glitchAnimationClass,
  `
 .${glitchAnimationClass} {
     filter: url(#${glitchFilterId});
     transform: translate(-50px, -50px);
 }
   `,
  'glitch',
 );
})();
