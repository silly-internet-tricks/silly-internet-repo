// ==UserScript==
// @name         Static
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  animated static effect on the element you select
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        unsafeWindow
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/text-effect/staticify.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/664c8801b9616b66cb34ceecedbf7537/raw/staticify.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/664c8801b9616b66cb34ceecedbf7537/raw/staticify.meta.js
// ==/UserScript==
import generalAnimationifier from '../../lib/effects/general-animation-ifier';

const staticAnimationClass: string = 'static-animation';

(function staticify() {
 const filter = document.createElement('div');

 filter.innerHTML = `
<svg width="0">
<filter id="static-filter-small" transform="scale(4, 1)">
    <feTurbulence
      type="turbulence"
      baseFrequency="0.05"
      numOctaves="1"
      result="turbulence" />
    <feDisplacementMap
      in2="turbulence"
      in="SourceGraphic"
      scale="8"
      xChannelSelector="R"
      yChannelSelector="G" />
</filter>
<filter id="static-filter-large" transform="scale(4, 1)">
    <feTurbulence
      type="turbulence"
      baseFrequency="0.05"
      numOctaves="1"
      result="turbulence" />
    <feDisplacementMap
      in2="turbulence"
      in="SourceGraphic"
      scale="24"
      xChannelSelector="R"
      yChannelSelector="G" />
</filter>
</svg>
`;

 const body = document.querySelector('body');
 body.appendChild(filter);

 const feTurbulenceSmall = document.querySelector('#static-filter-small feTurbulence');
 const feTurbulenceLarge = document.querySelector('#static-filter-large feTurbulence');

 const animationCallback = () => {
  feTurbulenceSmall.setAttribute('baseFrequency', `0.0 ${Math.random() * 0.2 + 0.65}`);
  feTurbulenceLarge.setAttribute('baseFrequency', `0.0 ${Math.random() * 0.2 + 0.65}`);
  requestAnimationFrame(animationCallback);
 };

 requestAnimationFrame(animationCallback);

 generalAnimationifier(
  staticAnimationClass,
  `
 .${staticAnimationClass} {
     filter: url(#static-filter-small);
     transform: translate(-3px, -3px);
 }

 .${staticAnimationClass}:hover {
    filter: url(#static-filter-large);
    transform: translate(-8px, -8px);
 }
   `,
  'static',
 );
})();
