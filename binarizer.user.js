// ==UserScript==
// @name         binarizer
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  quickly turn to binary
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// ==/UserScript==

(function binarizer() {
  const makeTextBinary = function makeTextBinary(text) {
    return [...text].map((c) => (
      c.charCodeAt(0).toString(2).padStart(8, '0')
    )).join(' ');
  };

  const binarizerHandler = function binarizerHandler(event) {
    event.preventDefault();
    const { target } = event;
    if (!target.targetChildNodes) {
      const targetChildNodes = [...target.childNodes];

      target.targetChildNodes = targetChildNodes;

      const childNodeBinarizer = function childNodeBinarizer(childNodes) {
        const newChildNodes = [];

        let prevNodeWasText = false;
        childNodes.forEach((node) => {
          if (node.nodeName === '#text') {
            if (prevNodeWasText) newChildNodes.push(new Text(' '));
            newChildNodes.push(new Text(makeTextBinary(node.textContent)));
            prevNodeWasText = true;
          } else {
            const freshNode = document.createElement(node.tagName);
            const freshChildNodes = childNodeBinarizer([...node.childNodes]);
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
      childNodeBinarizer(targetChildNodes).forEach((node) => target.appendChild(node));

      document.removeEventListener('click', binarizerHandler);
    }
  };

  // TODO: update linter
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
      document.addEventListener('click', binarizerHandler);
    }

    if (code === 'KeyZ') {
      document.addEventListener('click', undoHandler);
    }
  });

  document.addEventListener('keyup', ({ code }) => {
    if (code === 'KeyB') {
      document.removeEventListener('click', binarizerHandler);
    }

    if (code === 'KeyZ') {
      document.removeEventListener('click', undoHandler);
    }
  });
}());
