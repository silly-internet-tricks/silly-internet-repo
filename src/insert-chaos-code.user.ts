// ==UserScript==
// @name         Insert Chaos Code
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Make the local llm (using ollama) insert code into the webpage
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/*
// @match        https://developer.mozilla.org/en-US/docs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/insert-chaos-code.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/3c1ced5be548f02383a1ed3e21480a81/raw/insert-chaos-code.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/3c1ced5be548f02383a1ed3e21480a81/raw/insert-chaos-code.meta.js
// ==/UserScript==

import getHtmlAndCssBlocksFromMarkdown from './get-html-and-css-blocks-from-markdown';
import getOllamaGeneratedResponse from './get-ollama-generated-response';
import highlightElement from './highlight-element';
import makeAvailableKeys from './make-available-keys';

(function insertChaosCode() {
 // prettier-ignore
 const prompt: string = 'Please add an HTML element to complete the following incomplete snippet of markup. Use syntactically correct HTML to be viewed in a standards-compliant web browser. We need to impress the client, so use visually appealing CSS styling with liberal ornamentation and ostentatious flair. Make your code as flashy as you like. This is a playful project; chaos is welcome! Here is the code we have so far: ';
 const ollamaAddress: string = 'http://localhost:11434/';
 const model: string = 'codegemma:latest';

 interface UndoStackElement {
  htmlElement: HTMLElement;
  prevInnerHTML: string;
 }
 const undoStack: UndoStackElement[] = [];
 const redoStack: UndoStackElement[] = [];

 type ClickEventListener = (stopHighlighting: () => void) => (e: Event) => void;
 const clickEventListener: ClickEventListener = function clickEventListener(stopHighlighting) {
  return async ({ target }) => {
   stopHighlighting();

   const htmlElement: HTMLElement = target as HTMLElement;

   const originalInnerHTML: string = htmlElement.innerHTML;
   const style: HTMLStyleElement = document.createElement('style');
   document.body.appendChild(style);

   undoStack.push({ htmlElement, prevInnerHTML: htmlElement.innerHTML });
   let responseSoFar: string = '';

   await getOllamaGeneratedResponse(
    ollamaAddress,
    model,
    prompt + htmlElement.outerHTML.replace(/<\/[^>]*>$/, ''),
    (response) => {
     responseSoFar += response;

     const htmlAndCss: { html: string[]; css: string[] } = getHtmlAndCssBlocksFromMarkdown(responseSoFar);

     if (htmlAndCss.html.length > 0) {
      htmlElement.innerHTML = htmlAndCss.html.join('');
     } else {
      // in this case I don't think the assignment can be replaced with operator assignment
      // because it won't correctly interpret the markup as it's added one token at a time
      // eslint-disable-next-line operator-assignment
      const responseSoFarNoCss: string = htmlAndCss.css
       .reduce((acc, e) => acc.replace(e, ''), responseSoFar)
       .replace(/```css```/g, '');

      htmlElement.innerHTML = originalInnerHTML + responseSoFarNoCss;
     }

     style.innerHTML = htmlAndCss.css.join('');
    },
   );

   console.log(responseSoFar);
  };
 };

 const getAvailableKey: (requestedKeys: string[], label: string) => string = makeAvailableKeys();
 const insertKey: string = `Key${getAvailableKey(['l', 'k'], 'insert chaos code').toLocaleUpperCase()}`;
 const undoKey: string = `Key${getAvailableKey(['z', 't'], 'chaos code undo').toLocaleUpperCase()}`;
 const redoKey: string = `Key${getAvailableKey(['y', 'u'], 'chaos code redo').toLocaleUpperCase()}`;

 const { startHighlighting, stopHighlighting } = highlightElement();
 const eventListener: (e: Event) => void = clickEventListener(stopHighlighting);

 document.addEventListener('keydown', ({ code }) => {
  if (code === insertKey) {
   startHighlighting();
   document.addEventListener('click', eventListener);
  } else if (code === undoKey) {
   const { htmlElement, prevInnerHTML } = undoStack.pop();
   redoStack.push({ htmlElement, prevInnerHTML: htmlElement.innerHTML });
   htmlElement.innerHTML = prevInnerHTML;
  } else if (code === redoKey) {
   const { htmlElement, prevInnerHTML } = redoStack.pop();
   undoStack.push({ htmlElement, prevInnerHTML: htmlElement.innerHTML });
   htmlElement.innerHTML = prevInnerHTML;
  }
 });

 document.addEventListener('keyup', ({ code }) => {
  if (code === insertKey) {
   stopHighlighting();
   document.removeEventListener('click', eventListener);
  }
 });
})();
