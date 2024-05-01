// ==UserScript==
// @name         Insert Chaos Code
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Make the local llm (using ollama) insert code into the webpage
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/*
// @match        https://developer.mozilla.org/en-US/docs/*
// @match        https://stackoverflow.com/*
// @match        https://tvtropes.org/pmwiki/pmwiki.php/*
// @match        https://www.npmjs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/insert-chaos-code.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/3c1ced5be548f02383a1ed3e21480a81/raw/insert-chaos-code.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/3c1ced5be548f02383a1ed3e21480a81/raw/insert-chaos-code.meta.js
// ==/UserScript==

import getHtmlAndCssBlocksFromMarkdown from '../../lib/ollama/get-html-and-css-blocks-from-markdown';
import getOllamaGeneratedResponse from '../../lib/ollama/get-ollama-generated-response';
import makeAvailableKeys from '../../lib/util/make-available-keys';
import holdKeyAndClick from '../../lib/util/hold-key-and-click';

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

 const clickCallback: (event: Event) => void = (event: Event) => {
  const htmlElement: HTMLElement = event.target as HTMLElement;

  const originalInnerHTML: string = htmlElement.innerHTML;
  const style: HTMLStyleElement = document.createElement('style');
  document.body.appendChild(style);

  undoStack.push({ htmlElement, prevInnerHTML: htmlElement.innerHTML });
  let responseSoFar: string = '';

  getOllamaGeneratedResponse(
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
  ).then(() => {
   console.log(responseSoFar);
  });
 };

 const getAvailableKey: (requestedKeys: string[], label: string) => string = makeAvailableKeys();
 const undoKey: string = `Key${getAvailableKey(['z', 't'], 'chaos code undo').toLocaleUpperCase()}`;
 const redoKey: string = `Key${getAvailableKey(['y', 'u'], 'chaos code redo').toLocaleUpperCase()}`;

 holdKeyAndClick(['l', 'k'], clickCallback, 'chaos code');

 document.addEventListener('keydown', ({ code }) => {
  if (code === undoKey) {
   const { htmlElement, prevInnerHTML } = undoStack.pop();
   redoStack.push({ htmlElement, prevInnerHTML: htmlElement.innerHTML });
   htmlElement.innerHTML = prevInnerHTML;
  } else if (code === redoKey) {
   const { htmlElement, prevInnerHTML } = redoStack.pop();
   undoStack.push({ htmlElement, prevInnerHTML: htmlElement.innerHTML });
   htmlElement.innerHTML = prevInnerHTML;
  }
 });
})();
