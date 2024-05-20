// ==UserScript==
// @name         Jeff
// @namespace    http://tampermonkey.net/
// @version      2024-05-15
// @description  Jeff the Killer Jump Scare!
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/userscripts/creepy/jeff.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/ec46427ee08ca2252bab339cca3fcaac/raw/jeff.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/ec46427ee08ca2252bab339cca3fcaac/raw/jeff.meta.js
// ==/UserScript==

import jeffImage from '../../../assets/jeff';
import insertCSS from '../../lib/util/insert-css';
import polarCoordsToPercent from '../../lib/util/polar-coords-to-percent';

(function jeff() {
 // generating the clip path will have two stages
 // (so that I can understand the process more easily)
 // 1. generate the polar coordinates at random
 // (angle will be 0, 12, 24, 36 degrees, etc.)
 // (radius will be random)
 // 2. convert polar coordinates to percent numbers

 // in order to randomly grow our coords outwards,
 // we will first create a list of all the radii
 const initRadii = new Array(30).fill(0);
 const radiiSteps = new Array(10).fill(0).reduce(
  (acc) => {
   const step = acc[acc.length - 1].map((e: number) => Math.random() * 0.66 + e);
   acc.push(step);
   return acc;
  },
  [initRadii],
 );

 const keyframes = radiiSteps
  .map(
   (e: number[], i: number) => `
 ${10 * i}% {
  clip-path: polygon(
   ${e
    .map((radius, j) => polarCoordsToPercent(12 * j, radius))
    .map(({ horizontalPercent, verticalPercent }) => `${horizontalPercent}% ${verticalPercent}%`)
    .join(', ')}
  );
 }
 `,
  )
  .join('');

 insertCSS(`
 #sit-jeff-image {
  background-image: url(${jeffImage});
 }
 `);

 const animationDelay = Math.random() * 1000;

 insertCSS(`
 .jeff-clip-animation {
  animation-name: jeff-the-killer;
  animation-duration: 3s;
  animation-iteration-count: 1;
  animation-timing-function: linear;
  animation-delay: ${animationDelay}s;
  animation-fill-mode: forwards;
  clip-path: polygon(0% 0%, 0% 0%, 0% 0%);
 }

 .jeff-position {
  position: fixed;
  inset: 0;
  z-index: 11111;
 }

 #sit-jeff-image {
  background-size: cover;
  background-position: center;
 }

 #sit-jeff-image-parent {
  filter: url(#jeff-inset-drop-shadow)
 }

 @keyframes jeff-the-killer {
  ${keyframes}
 }
 `);

 // TODO: see if there is some other more straightforward simple way to do the inset drop shadow

 // in the matrix, using zeroes in the rgb channels is expected to give us
 // a black result in the inverted alpha channel
 const filterSvg = `
 <svg width=0>
   <filter id="jeff-inset-drop-shadow">
     <feColorMatrix
       in="SourceAlpha"
       type="matrix"
       values="0 0 0 0  0
               0 0 0 0  0
               0 0 0 0  0
               0 0 0 -1 1"
       result="inverted-alpha"
      />
     <feGaussianBlur
       in="inverted-alpha"
       stdDeviation="10"
       result="blurred"
     />
     <feOffset
       in="blurred"
       dx="5"
       dy="5"
       result="offset"
     />
     <feComposite
       in="offset"
       in2="SourceGraphic"
       operation="in"
     />
   </filter>
 </svg>
 `;

 const filterDiv = document.createElement('div');
 filterDiv.innerHTML = filterSvg;
 document.body.appendChild(filterDiv);

 const grandpaDiv = document.createElement('div');
 grandpaDiv.id = 'sit-jeff-image-grandpa';
 grandpaDiv.classList.add('jeff-position');
 grandpaDiv.classList.add('jeff-clip-animation');

 const parentDiv = document.createElement('div');
 parentDiv.id = 'sit-jeff-image-parent';
 parentDiv.classList.add('jeff-position');

 const div = document.createElement('div');
 div.id = 'sit-jeff-image';
 div.classList.add('jeff-position');
 div.classList.add('jeff-clip-animation');

 document.body.appendChild(grandpaDiv);
 grandpaDiv.appendChild(parentDiv);
 parentDiv.appendChild(div);

 // notes
 // okay so the animation is going to be jeff appearing (seemingly from behind the site)
 // after a random amount of time has passed
 // the animation concept is to use a clip path to try to kind of make it look like
 // the jeff image is tearing its way out of the page
})();
