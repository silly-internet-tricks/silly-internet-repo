// ==UserScript==
// @name         Glitch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  animated glitch effect on the element you select
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/glitch.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/a264ce6c2e4640d1348fe5ea59f3e0e0/raw/glitch.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/a264ce6c2e4640d1348fe5ea59f3e0e0/raw/glitch.meta.js
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
 filter.style.setProperty('z-index', '-1');

 filter.innerHTML = glitchSvg(30, glitchFilterId);

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
