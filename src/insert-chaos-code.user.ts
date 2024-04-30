// ==UserScript==
// @name         Insert Chaos Code
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Make the local llm (using ollama) insert code into the webpage
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/insert-chaos-code.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/00426b084f8089a2cc1c4289e930cede/raw/insert-chaos-code.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/00426b084f8089a2cc1c4289e930cede/raw/insert-chaos-code.meta.js
// ==/UserScript==

(function getAINonsense() {
 // prettier-ignore
 const prompt: string = 'Please add an HTML element to complete the following incomplete snippet of markup. Use syntactically correct HTML to be viewed in a standards-compliant web browser. We need to impress the client, so use visually appealing CSS styling with liberal ornamentation and ostentatious flair. Make your code as flashy as you like. This is a playful project; chaos is welcome! Here is the code we have so far: ';
 const ollamaAddress: string = 'http://localhost:11434/';
 const model: string = 'starcoder2:latest';

 interface UndoStackElement {
  htmlElement: HTMLElement;
  prevInnerHTML: string;
 }
 const undoStack: UndoStackElement[] = [];
 const redoStack: UndoStackElement[] = [];

 const clickEventListener: (e: Event) => void = ({ target }) => {
  const htmlElement: HTMLElement = target as HTMLElement;

  undoStack.push({ htmlElement, prevInnerHTML: htmlElement.innerHTML });

  const requestOptions: GmXmlHttpRequestRequestOptions = {
   url: `${ollamaAddress}api/generate`,
   method: 'POST',
   responseType: 'stream',
   data: JSON.stringify({ model, prompt: prompt + htmlElement.outerHTML.replace(/<\/[^>]*>$/, '') }),
   fetch: true,
   onloadstart: async ({ response }) => {
    // I think this is the idiomatic way to usually handle streams.
    // Next time I'll try it a different way, but I'm ignoring the linter this time
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of response) {
     const responseJSON: { response: string } = JSON.parse(
      [...chunk].map((b) => String.fromCharCode(b)).join(''),
     );

     htmlElement.innerHTML += responseJSON.response;
    }
   },
  };

  // @ts-expect-error GM is defined as part of the API for the tampermonkey chrome extension
  GM.xmlHttpRequest(requestOptions);
 };

 document.addEventListener('keydown', ({ code }) => {
  if (code === 'KeyL') {
   document.addEventListener('click', clickEventListener);
  } else if (code === 'KeyZ') {
   const { htmlElement, prevInnerHTML } = undoStack.pop();
   redoStack.push({ htmlElement, prevInnerHTML: htmlElement.innerHTML });
   htmlElement.innerHTML = prevInnerHTML;
  } else if (code === 'KeyY') {
   const { htmlElement, prevInnerHTML } = redoStack.pop();
   undoStack.push({ htmlElement, prevInnerHTML: htmlElement.innerHTML });
   htmlElement.innerHTML = prevInnerHTML;
  }
 });

 document.addEventListener('keyup', ({ code }) => {
  if (code === 'KeyL') {
   document.removeEventListener('click', clickEventListener);
  }
 });
})();
