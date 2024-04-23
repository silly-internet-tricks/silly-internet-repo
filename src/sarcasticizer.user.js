// ==UserScript==
// @name         sarcasticizer
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  quickly turn to sarcasm
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// ==/UserScript==

(function sarcasticizer() {
 const makeTextSarcasticish = function makeTextSarcasticish(text) {
  return [...text].map((c, i) => (
   i % 2 ? c.toLocaleLowerCase() : c.toLocaleUpperCase()
  )).join('');
 };

 const sarcasticizerHandler = function sarcasticizerHandler(event) {
  event.preventDefault();
  const { target } = event;
  if (!target.targetChildNodes) {
   const targetChildNodes = [...target.childNodes];

   target.targetChildNodes = targetChildNodes;

   const childNodeSarcasticizer = function childNodeSarcasticizer(childNodes) {
    const newChildNodes = [];

    let prevNodeWasText = false;
    childNodes.forEach((node) => {
     if (node.nodeName === '#text') {
      if (prevNodeWasText) newChildNodes.push(new Text(' '));
      newChildNodes.push(new Text(makeTextSarcasticish(node.textContent)));
      prevNodeWasText = true;
     } else {
      const freshNode = document.createElement(node.tagName);
      const freshChildNodes = childNodeSarcasticizer([...node.childNodes]);
      freshChildNodes.forEach((freshChildNode) => {
       freshNode.appendChild(freshChildNode);
      });

      newChildNodes.push(freshNode);
      prevNodeWasText = false;
     }
    });

    return newChildNodes;
   };

   target.innerHTML = '';
   childNodeSarcasticizer(targetChildNodes).forEach((node) => target.appendChild(node));

   document.removeEventListener('click', sarcasticizerHandler);
  }
 };

 const revertChildNodes = function revertChildNodes(element) {
  if (!element) return;
  if (element.targetChildNodes) {
   element.innerHTML = '';
   element.targetChildNodes.forEach((node) => {
    element.appendChild(node);
   });

   delete element.targetChildNodes;
  } else {
   revertChildNodes(element.parentNode);
  }
 };

 // TODO: this is basically what I had in the binary bot: opportunity for code reuse
 const undoHandler = function undoHandler(event) {
  event.preventDefault();

  const { target } = event;

  revertChildNodes(target);
 };

 document.addEventListener('keydown', ({ code }) => {
  if (code === 'KeyB') {
   document.addEventListener('click', sarcasticizerHandler);
  }

  if (code === 'KeyZ') {
   document.addEventListener('click', undoHandler);
  }
 });

 document.addEventListener('keyup', ({ code }) => {
  if (code === 'KeyB') {
   document.removeEventListener('click', sarcasticizerHandler);
  }

  if (code === 'KeyZ') {
   document.removeEventListener('click', undoHandler);
  }
 });
}());
