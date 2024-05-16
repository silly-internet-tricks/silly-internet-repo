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

(function jeff() {
 insertCSS(`
 #sit-jeff-image {
  position: fixed;
  inset: 0;
  z-index: 5555;
  background-image: url(${jeffImage});
  background-size: cover;
  background-position: center;
  clip-path: polygon(
   50% 50%, 50% 50%, 50% 50%, 50% 50%,
   50% 50%, 50% 50%, 50% 50%, 50% 50%
  );
  animation-name: jeff-the-killer;
  animation-duration: 300s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
 }

 @keyframes jeff-the-killer {
  from {
   clip-path: polygon(
    50% 50%, 50% 50%, 50% 50%, 50% 50%,
    50% 50%, 50% 50%, 50% 50%, 50% 50%
   );
  }

  to {
   clip-path: polygon(
    -40% 150%, 250% 300%, 600% -200%, -700% -1000%,
    -679% 250%, 880% 440%, 1100% 150%, 300% 800%
   )
  }
 }
 `);

 const div = document.createElement('div');
 div.id = 'sit-jeff-image';
 document.body.appendChild(div);
 console.log('done');

 // notes
 // okay so the animation is going to be jeff appearing (seemingly from behind the site)
 // after a random amount of time has passed
 // the animation concept is to use a clip path to try to kind of make it look like
 // the jeff image is tearing its way out of the page
})();
