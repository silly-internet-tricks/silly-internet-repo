// ==UserScript==
// @name         binary bot translator
// @namespace    http://tampermonkey.net/
// @version      2024-04-21
// @description  instantly decipher binary bot posts
// @author       Josh Parker
// @match        https://www.butterflies.ai/users/binary_bot_101
// @match        https://www.butterflies.ai/users/binary_bot_101/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=butterflies.ai
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/binary-bot-translator.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/0e9116c846c15f19b39e04a651345bdc/raw/binary-bot-translator.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/0e9116c846c15f19b39e04a651345bdc/raw/binary-bot-translator.meta.js
// ==/UserScript==

(function binaryBotTranslator() {
 type EventListener = (e: Event) => void;
 const clickEventListener: EventListener = function clickEventListener(event: Event) {
  const target: Element = event.target as Element;
  if (!target) throw new Error(`${target} is expected to be truthy`);
  if (!target.nodeType) throw new Error(`${target} is expected to be a Node`);
  if (!target.tagName) throw new Error(`${target} is expected to be an Element`);
  const targetChildNodes: NodeListOf<ChildNode> = target.childNodes;
  target.innerHTML = '';

  // @ts-expect-error: this is a property I dynamically add to the element in order to access it later
  target['target-child-nodes'] = targetChildNodes;

  targetChildNodes.forEach((node, i) => {
   if (node.nodeName === '#text') {
    if (node.textContent === null) {
     throw new Error(`text node ${node} was expected to have text content!`);
    }

    const nodeText: string = node.textContent;

    // this seems to me like exactly the kind of anti-pattern they tell you to steer far clear from
    // because it looks like the kind of thing that will thwart javascript engine optimizations
    // so, why is it like this?
    // to try to satisfy my config for both prettier and eslint
    // 🧟 🧟 🧟 🧟
    // 🧟 🧟 🧟 🧟
    const skipSingleSpaceConditions: boolean[] = [
     nodeText === ' ',
     targetChildNodes[i - 1]?.nodeName === '#text',
     targetChildNodes[i + 1]?.nodeName === '#text',
     !!targetChildNodes[i - 1]?.textContent?.match(/[01]{8}/),
     !!targetChildNodes[i + 1]?.textContent?.match(/[01]{8}/),
    ];

    if (skipSingleSpaceConditions.every((e) => e)) {
     return;
    }

    console.log(nodeText);
    const binaryRegExpPattern: RegExp = /[01]{8}( ?[01]{8})*/;
    const translatedBinary: RegExpMatchArray | null = nodeText.match(binaryRegExpPattern);
    if (translatedBinary === null) {
     target.appendChild(new Text(nodeText));
    } else {
     // TODO: check for the case where there is more than one run of bytes in a single text node
     target.appendChild(
      new Text(
       nodeText.replace(
        binaryRegExpPattern,
        translatedBinary[0]
         .split(' ')
         .map((e) => String.fromCharCode(Number.parseInt(e, 2)))
         ?.join(''),
       ),
      ),
     );
    }
   } else {
    target.appendChild(node);
   }
  });
 };

 const undoListener: EventListener = (event) => {
  const target: Element = event.target as Element;
  if (!target) throw new Error(`${target} is expected to be truthy`);
  if (!target.nodeType) throw new Error(`${target} is expected to be a Node`);
  if (!target.tagName) throw new Error(`${target} is expected to be an Element`);

  // @ts-expect-error: this is a property I dynamically add to the element in order to access it later
  const targetChildNodes: Node[] = target['target-child-nodes'];
  console.log(targetChildNodes);
  if (targetChildNodes) {
   target.innerHTML = '';
   targetChildNodes.forEach((node) => target.appendChild(node));
  }
 };

 document.addEventListener('keydown', ({ code }) => {
  if (code === 'KeyB') {
   document.body.addEventListener('click', clickEventListener);
  }

  if (code === 'KeyZ') {
   document.body.addEventListener('click', undoListener);
  }
 });

 document.addEventListener('keyup', ({ code }) => {
  if (code === 'KeyB') {
   document.body.removeEventListener('click', clickEventListener);
  }

  if (code === 'KeyZ') {
   document.body.removeEventListener('click', undoListener);
  }
 });
})();
