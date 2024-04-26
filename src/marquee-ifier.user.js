// ==UserScript==
// @name         Marquee-ifier
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Make the element you select act like an animated marquee element
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

import insertCSS from './insert-css';
import generalElementEffectifier from './general-element-effectifier';
import elementEffectHandler from './element-effect-handler';

(function marqueeifier() {
 // 1 add the element to be animated, as the only child of the element being marqueeified
 // 2 add the content to the element from 1
 // 3 flatten the content from 2 to one line of text
 // 4 find the width of this whole one line of text
 // 5 use the width from 4 to define the animation keyframes
 // 6 add the animation styling to the element from 1

 const affectElement = function affectElement(freshNode) {
  freshNode.style.setProperty('text-wrap', 'nowrap');
  freshNode.style.setProperty('width', 'fit-content');
  return freshNode;
 };

 const marqueeContainer = document.createElement('div');

 const affectTarget = (target) => {
  marqueeContainer.classList.add('marquee-container');
  target.appendChild(marqueeContainer);
  return marqueeContainer;
 };

 const affectTargetChildNodes = (childNodes) => (
  elementEffectHandler(childNodes, (node) => [node], affectElement)
 );

 const generalElementEffectifierCallback = (target, targetChildNodes) => {
  const affectedElementParent = affectTarget(target);
  affectTargetChildNodes(targetChildNodes)
   .forEach((node) => affectedElementParent.appendChild(node));

  console.log(target);

  const mcpWidth = target.getBoundingClientRect().width;
  console.log(mcpWidth);
  const mcWidth = marqueeContainer.getBoundingClientRect().width;
  console.log(mcWidth);

  insertCSS(`
  .marquee-container-parent {
    overflow: hidden;
  }
  
  .marquee-container {
    width: fit-content;
    animation-name: marquee;
    animation-duration: 20s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  
  @keyframes marquee {
   from {
    transform: translateX(${mcpWidth}px);
   }
  
   to {
    transform: translateX(-${mcWidth}px);
   }
  }
    `);
 };

 generalElementEffectifier(generalElementEffectifierCallback, 'marqueeifier', 'marquee-container-parent');
}());