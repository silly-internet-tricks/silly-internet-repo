// ==UserScript==
// @name         Wiggle Glitch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  animated wiggling glitch effect on the element you select
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// ==/UserScript==
import generalAnimationifier from '../../lib/effects/general-animation-ifier';
import glitchSvg from '../../lib/effects/effect-util/glitch-svg';

const glitchAnimationClass: string = 'wiggle-glitch-animation';
const glitchFilterId: string = 'wiggle-glitch-filter';

(function glitchify() {
 const filter = document.createElement('div');
 filter.style.setProperty('position', 'fixed');
 filter.style.setProperty('width', '101dvw');
 filter.style.setProperty('height', '101dvh');

 filter.innerHTML = glitchSvg(30, glitchFilterId, true);

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
  'wiggle-glitch',
 );
})();