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

 // TODO: refactor please: a lot of repetition here... NotLikeThis
 const animationCallback = () => {
  const baseFrequencySmall = Number(feTurbulenceSmall.getAttribute('baseFrequency').match(/\d+\.\d+$/));
  const baseFrequencyLarge = Number(feTurbulenceLarge.getAttribute('baseFrequency').match(/\d+\.\d+$/));
  if (baseFrequencySmall < 0.65) {
   feTurbulenceSmall.setAttribute('baseFrequency', `0.0 ${baseFrequencySmall + Math.random() * 0.2}`);
  } else if (baseFrequencySmall > 0.85) {
   feTurbulenceSmall.setAttribute('baseFrequency', `0.0 ${baseFrequencySmall - Math.random() * 0.2}`);
  } else {
   feTurbulenceSmall.setAttribute('baseFrequency', `0.0 ${baseFrequencySmall + Math.random() * 0.2 - 0.1}`);
  }

  if (baseFrequencyLarge < 0.65) {
   feTurbulenceLarge.setAttribute('baseFrequency', `0.0 ${baseFrequencyLarge + Math.random() * 0.2}`);
  } else if (baseFrequencyLarge > 0.85) {
   feTurbulenceLarge.setAttribute('baseFrequency', `0.0 ${baseFrequencyLarge - Math.random() * 0.2}`);
  } else {
   feTurbulenceLarge.setAttribute('baseFrequency', `0.0 ${baseFrequencyLarge + Math.random() * 0.2 - 0.1}`);
  }

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

 .${staticAnimationClass}.large {
    filter: url(#static-filter-large);
    transform: translate(-8px, -8px);
 }
   `,
  'static',
  [
   {
    eventType: 'mouseover',
    eventListener: ({ target }) => {
     if (target instanceof HTMLElement) target.classList.add('large');
    },
   },
   {
    eventType: 'mouseout',
    eventListener: ({ target }) => {
     if (target instanceof HTMLElement) target.classList.remove('large');
    },
   },
  ],
 );
})();
