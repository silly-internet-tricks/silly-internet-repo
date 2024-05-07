// ==UserScript==
// @name         Static
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  animated static effect on the element you select
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// ==/UserScript==
import generalAnimationifier from '../../lib/effects/general-animation-ifier';

const staticAnimationClass: string = 'static-animation';

(function staticify() {
 const filter = document.createElement('div');

 filter.innerHTML = `
<svg width="0">
<filter id="static-filter">
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
</svg>
`;

 const body = document.querySelector('body');
 body.appendChild(filter);

 const feTurbulence = document.querySelector('#static-filter feTurbulence');
 const animationCallback = () => {
  const baseFrequency = Number(feTurbulence.getAttribute('baseFrequency'));
  if (baseFrequency < 0.65) {
   feTurbulence.setAttribute('baseFrequency', `${baseFrequency + Math.random() * 0.2}`);
  } else if (baseFrequency > 0.85) {
   feTurbulence.setAttribute('baseFrequency', `${baseFrequency - Math.random() * 0.2}`);
  } else {
   feTurbulence.setAttribute('baseFrequency', `${baseFrequency + Math.random() * 0.2 - 0.1}`);
  }

  requestAnimationFrame(animationCallback);
 };

 requestAnimationFrame(animationCallback);

 const feDisplacementMap = document.querySelector('#static-filter feDisplacementMap');

 generalAnimationifier(
  staticAnimationClass,
  `
 .${staticAnimationClass} {
     filter: url(#static-filter);
 }
   `,
  'static',
  [
   { eventType: 'mouseover', eventListener: () => feDisplacementMap.setAttribute('scale', '24') },
   { eventType: 'mouseout', eventListener: () => feDisplacementMap.setAttribute('scale', '8') },
  ],
 );
})();
