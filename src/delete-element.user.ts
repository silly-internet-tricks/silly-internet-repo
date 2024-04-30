// ==UserScript==
// @name         Delete Element
// @namespace    http://tampermonkey.net/
// @version      2024-04-30
// @description  just delete the element you select
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// ==/UserScript==

import makeAvailableKeys from './make-available-keys';
import holdKeyAndClick from './hold-key-and-click';

(function deleteElement() {
 interface UndoStackElement {
  htmlElement: HTMLElement;
  prevDisplay?: string;
 }

 const undoStack: UndoStackElement[] = [];
 const redoStack: UndoStackElement[] = [];

 const clickCallback: (event: Event) => void = (event: Event) => {
  const htmlElement: HTMLElement = event.target as HTMLElement;

  const prevDisplay: string = htmlElement.style.getPropertyValue('display');
  htmlElement.style.setProperty('display', 'none');

  undoStack.push({ htmlElement, prevDisplay });
 };

 const getAvailableKey: (requestedKeys: string[], label: string) => string = makeAvailableKeys();
 const undoKey: string = `Key${getAvailableKey(['z', 't'], 'log element undo').toLocaleUpperCase()}`;
 const redoKey: string = `Key${getAvailableKey(['y', 'u'], 'log element redo').toLocaleUpperCase()}`;

 holdKeyAndClick(['l', 'k'], clickCallback, 'delete');

 document.addEventListener('keydown', ({ code }) => {
  if (code === undoKey) {
   const { htmlElement, prevDisplay } = undoStack.pop();
   redoStack.push({ htmlElement });
   if (prevDisplay) {
    htmlElement.style.setProperty('display', prevDisplay);
   }
  } else if (code === redoKey) {
   const { htmlElement } = redoStack.pop();
   undoStack.push({ htmlElement, prevDisplay: htmlElement.style.getPropertyValue('display') });
   htmlElement.style.setProperty('display', 'none');
  }
 });
})();
