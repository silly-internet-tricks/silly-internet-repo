// ==UserScript==
// @name         Log Element Classes
// @namespace    http://tampermonkey.net/
// @version      2024-04-30
// @description  just console log the classes of the element you select, sorted by number of elements that have a class attribute containing the class text
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/util/log-element-classes.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/b0047711ca333e777fe20e8ab9e88fdf/raw/log-element-classes.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/b0047711ca333e777fe20e8ab9e88fdf/raw/log-element-classes.meta.js
// ==/UserScript==

import holdKeyAndClick from '../../lib/util/hold-key-and-click';

(function logElementClasses() {
 holdKeyAndClick(
  ['l', 'o', 'g'],
  (event) => {
   event.preventDefault();
   const htmlElement: HTMLElement = event.target as HTMLElement;
   const classCount: (c: string) => number = (c) => document.querySelectorAll(`[class*="${c}"]`).length;
   console.log(
    [...htmlElement.classList]
     .map((c) => ({ c, numberOfElementsWithClass: classCount(c) }))
     .sort((a, b) => a.numberOfElementsWithClass - b.numberOfElementsWithClass),
   );
  },
  'log',
 );
})();
