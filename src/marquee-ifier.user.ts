// ==UserScript==
// @name         Marquee-ifier
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Make the element you select act like an animated marquee element
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/marquee-ifier.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/c9f4aa467ba3f24d1332f720f4f7c113/raw/marquee-ifier.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/c9f4aa467ba3f24d1332f720f4f7c113/raw/marquee-ifier.meta.js
// ==/UserScript==

import insertCSS from './insert-css';
import generalElementEffectifier from './general-element-effectifier';
import elementEffectHandler from './element-effect-handler';
import { makeInlineInlineBlock, undoInlineInlineBlock } from './make-inline-inline-block';
import getCssKeywordValue from './getCssKeywordValue';

(function marqueeifier() {
 let serialNumber: number = 0;
 // 1 add the element to be animated, as the only child of the element being marqueeified
 // 2 add the content to the element from 1
 // 3 flatten the content from 2 to one line of text
 // 4 find the width of this whole one line of text
 // 5 use the width from 4 to define the animation keyframes
 // 6 add the animation styling to the element from 1

 type AffectElement = (n: HTMLElement) => HTMLElement;
 const affectElement: AffectElement = function affectElement(freshElement: HTMLElement) {
  freshElement.style.setProperty('text-wrap', 'nowrap');
  freshElement.style.setProperty('width', 'fit-content');

  // NOTE: check the capitalization on tagNames.
  if (freshElement.tagName.toLocaleLowerCase() === 'br') {
   freshElement.style.setProperty('display', 'none');
  }

  return freshElement;
 };

 type AffectTarget = (t: HTMLElement, m: HTMLElement) => HTMLElement;
 const affectTarget: AffectTarget = (target, marqueeContainer) => {
  marqueeContainer.classList.add('marquee-container');
  marqueeContainer.style.setProperty('animation-name', `marquee-${serialNumber}`);
  target.appendChild(marqueeContainer);
  return marqueeContainer;
 };

 type TextNodeHandler = (n: Node) => HTMLElement[];
 const textNodeHandler: TextNodeHandler = function textNodeHandler(node) {
  const span: HTMLElement = document.createElement('span');
  span.style.setProperty('text-wrap', 'nowrap');
  span.style.setProperty('width', 'fit-content');
  span.appendChild(new Text(node.textContent));
  return [span];
 };

 type AffectTargetChildNodes = (childNodes: Node[]) => Node[];
 const affectTargetChildNodes: AffectTargetChildNodes = function affectTargetChildNodes(childNodes) {
  return elementEffectHandler(childNodes as ChildNode[], textNodeHandler, affectElement);
 };

 type GeneralElementEffectifierCallback = (target: HTMLElement, targetChildNodes: Node[]) => void;
 const generalElementEffectifierCallback: GeneralElementEffectifierCallback = (
  marqueeContainerParent,
  targetChildNodes,
 ) => {
  const mcpWidth: number = Math.round(marqueeContainerParent.getBoundingClientRect().width);
  // set an element style on the marquee container parent to prevent it from getting wider than it was.
  marqueeContainerParent.style.setProperty('width', `${mcpWidth}px`);

  const mcpDisplay: string = getCssKeywordValue(marqueeContainerParent, 'display');
  if (mcpDisplay === 'inline') {
   makeInlineInlineBlock(marqueeContainerParent);
  }

  const marqueeContainer: HTMLElement = document.createElement('div');
  const affectedElementParent: HTMLElement = affectTarget(marqueeContainerParent, marqueeContainer);

  type AppendChildToNode = (parentNode: Node) => (childNode: Node) => void;
  const appendChildToNode: AppendChildToNode = function appendChildToNode(parentNode) {
   return (childNode) => parentNode.appendChild(childNode);
  };

  affectTargetChildNodes(targetChildNodes).forEach(appendChildToNode(affectedElementParent));

  insertCSS(`
  .marquee-container-parent {
    overflow: hidden;
  }
  
  .marquee-container {
    width: fit-content;
    animation-duration: 20s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
    `);

  const mcWidth: number = Math.round(marqueeContainer.getBoundingClientRect().width);

  insertCSS(`
  @keyframes marquee-${serialNumber} {
   from {
    transform: translateX(${mcpWidth}px);
   }
  
   to {
    transform: translateX(-${mcWidth}px);
   }
  }
  `);

  serialNumber += 1;
 };

 generalElementEffectifier(
  generalElementEffectifierCallback,
  'marqueeifier',
  'marquee-container-parent',
  (element) => {
   // @ts-expect-error original display is an attribute that I add to the element specifically to use when I undo the animation
   const originalDisplay: string = element['original-display'];
   undoInlineInlineBlock(element as HTMLElement, originalDisplay);
  },
 );
})();
