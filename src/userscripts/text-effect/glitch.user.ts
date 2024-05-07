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

const glitchAnimationClass: string = 'glitch-animation';

(function glitchify() {
 const filter = document.createElement('div');

 filter.innerHTML = `
<svg id="glitch-image-source">
  <rect
    fill="#7fff00"
    style="animation-name: glitch-bar-one;
    animation-duration: 10s;
    animation-timing-function: linear;
    animation-iteration-count: infinite"

  />
  <rect
    fill="#ff7f00"
    style="animation-name: glitch-bar-two;
    animation-duration: 10s;
    animation-timing-function: linear;
    animation-iteration-count: infinite"

  />
</svg>
<svg width="0">
<filter id="glitch-filter" transform="scale(4, 1)">
    <feImage
      href="#glitch-image-source"
    />
    <feDisplacementMap
      in2="turbulence"
      in="SourceGraphic"
      scale="24"
      xChannelSelector="R"
      yChannelSelector="G" />
</filter>
</svg>
<style>
@keyframes glitch-bar-one {

}

@keyframes glitch-bar-two {

}
</style>
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
  glitchAnimationClass,
  `
 .${glitchAnimationClass} {
     filter: url(#static-filter-small);
     transform: translate(-3px, -3px);
 }

 .${glitchAnimationClass}.large {
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
