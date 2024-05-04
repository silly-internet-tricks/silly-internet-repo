// ==UserScript==
// @name         Delete Element
// @namespace    http://tampermonkey.net/
// @version      2024-04-30
// @description  just delete the element you select
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/delete-element.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/a1dea5ee7bbcebf6af16031713ee454b/raw/delete-element.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/a1dea5ee7bbcebf6af16031713ee454b/raw/delete-element.meta.js
// ==/UserScript==
// ==/UserScript==

import makeAvailableKeys from '../../lib/util/make-available-keys';
import holdKeyAndClick from '../../lib/util/hold-key-and-click';
import keyCodeMatch from '../../lib/util/key-code-match';

(function deleteElement() {
 interface UndoStackElement {
  htmlElement: HTMLElement;
  prevDisplay?: string;
 }

 const undoStack: UndoStackElement[] = [];
 const redoStack: UndoStackElement[] = [];

 const clickCallback: (event: Event) => void = (event: Event) => {
  event.preventDefault();
  const htmlElement: HTMLElement = event.target as HTMLElement;

  const prevDisplay: string = htmlElement.style.getPropertyValue('display');
  htmlElement.style.setProperty('display', 'none');

  undoStack.push({ htmlElement, prevDisplay });
 };

 const getAvailableKey: (requestedKeys: string[], label: string) => string = makeAvailableKeys();
 const undoKey: string = getAvailableKey(['z', 't'], 'delete element undo').toLocaleUpperCase();
 const redoKey: string = getAvailableKey(['y', 'u'], 'delete element redo').toLocaleUpperCase();

 holdKeyAndClick(['l', 'k'], clickCallback, 'delete');

 document.addEventListener('keydown', ({ code }) => {
  if (keyCodeMatch(undoKey, code)) {
   const { htmlElement, prevDisplay } = undoStack.pop();
   redoStack.push({ htmlElement });

   htmlElement.style.removeProperty('display');

   if (prevDisplay) {
    htmlElement.style.setProperty('display', prevDisplay);
   }
  } else if (keyCodeMatch(redoKey, code)) {
   const { htmlElement } = redoStack.pop();
   undoStack.push({ htmlElement, prevDisplay: htmlElement.style.getPropertyValue('display') });
   htmlElement.style.setProperty('display', 'none');
  }
 });
})();
