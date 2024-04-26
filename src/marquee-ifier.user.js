// ==UserScript==
// @name         Marquee-ifier
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Make the element you select act like an animated marquee element
// @author       Josh Parker
// @match        https://www.google.com/search?q=flexbox+exactly+the+same+width&oq=flexbox+exactly+the+same+width&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRigATIHCAMQIRigATIHCAQQIRifBTIHCAUQIRifBTIHCAYQIRifBTIHCAcQIRifBTIHCAgQIRifBTIHCAkQIRifBdIBCDU5NDRqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

import insertCSS from './insert-css';
import generalTextEffectifier from './general-text-effectifier';

(function marqueeifier() {
 // 1 add the element to be animated, as the only child of the element being marqueeified
 // 2 add the content to the element from 1
 // 3 flatten the content from 2 to one line of text
 // 4 find the width of this whole one line of text
 // 5 use the width from 4 to define the animation keyframes
 // 6 add the animation styling to the element from 1

 insertCSS(`

.marquee-container-parent {
  overflow: hidden;
}

.marquee-container {
  width: 200dvw;
}

.marquee-element {
  animation-name: marquee;
  animation-duration: 20s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes marquee {
 from {
  transform: translateX(20%);
 }

 to {
  transform: translateX(-70%);
 }
}
  `);

 const affectText = () => {

 };

 generalTextEffectifier(affectText, 'marqueeifier', 'marquee-container-parent');
}());
