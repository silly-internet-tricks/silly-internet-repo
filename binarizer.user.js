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

    const targetChildNodes = [...target.childNodes];

    target.targetChildNodes = targetChildNodes;

    const childNodeBinarizer = function childNodeBinarizer(childNodes) {
      const newChildNodes = [];

      childNodes.forEach((node) => {
        if (node.nodeName === '#text') {
          newChildNodes.push(new Text(makeTextBinary(node.textContent)));
        } else {
          const freshNode = document.createElement(node.tagName);
          const freshChildNodes = childNodeBinarizer([...node.childNodes]);
          freshChildNodes.forEach((freshChildNode) => {
            freshNode.appendChild(freshChildNode);
          });

          newChildNodes.push(freshNode);
        }
      });

      return newChildNodes;
    };

    target.innerHTML = '';
    childNodeBinarizer(targetChildNodes).forEach((node) => target.appendChild(node));

    document.removeEventListener('click', binarizerHandler);
  };

  // TODO: this is basically what I had in the binary bot: opportunity for code reuse
  const undoHandler = function undoHandler(event) {
    event.preventDefault();

    const { target } = event;

    if (target.targetChildNodes) {
      target.innerHTML = '';
      target.targetChildNodes.forEach((node) => {
        target.appendChild(node);
      });

      delete target.targetChildNodes;
    }
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
