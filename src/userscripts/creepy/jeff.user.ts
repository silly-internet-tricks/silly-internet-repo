// ==UserScript==
// @name         Jeff
// @namespace    http://tampermonkey.net/
// @version      2024-05-15
// @description  Jeff the Killer Jump Scare!
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
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

 const keyframes = radiiSteps.map(
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
 ).join('');

 insertCSS(`
 #sit-jeff-image {
  background-image: url(${jeffImage});
 }
 `);

 const animationDelay = Math.random() * 300;

 insertCSS(`
 #sit-jeff-image {
  position: fixed;
  inset: 0;
  z-index: 5555;
  background-size: cover;
  background-position: center;
  animation-name: jeff-the-killer;
  animation-duration: 3s;
  animation-iteration-count: 1;
  animation-timing-function: linear;
  animation-delay: ${animationDelay}s;
 }

 #sit-jeff-image-parent {
  position: fixed;
  inset: 0;
  z-index: 666;
 }

 @keyframes jeff-the-killer {
  ${keyframes}
 }
 `);

 // TODO: Try to get the inset drop shadow to work!
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
       stdDeviation="1"
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

 const parentDiv = document.createElement('div');
 const div = document.createElement('div');
 parentDiv.id = 'sit-jeff-image-parent';
 div.id = 'sit-jeff-image';
 document.body.appendChild(parentDiv);
 parentDiv.appendChild(div);

 // notes
 // okay so the animation is going to be jeff appearing (seemingly from behind the site)
 // after a random amount of time has passed
 // the animation concept is to use a clip path to try to kind of make it look like
 // the jeff image is tearing its way out of the page
})();
