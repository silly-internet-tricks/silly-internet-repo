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
// ==/UserScript==

(function binaryBotTranslator() {
    const clickEventListener = ({ target }) => {
        const targetChildNodes = [...target.childNodes];
        target.innerHTML = '';
        target.targetChildNodes = targetChildNodes;

        targetChildNodes.forEach((node, i) => {
            if (node.nodeName === '#text') {
                const nodeText = node.textContent;
                if (
                    nodeText === ' '
                    && targetChildNodes[i - 1]?.nodeName === '#text'
                    && targetChildNodes[i + 1]?.nodeName === '#text'
                    && targetChildNodes[i - 1]?.textContent.match(/[01]{8}/)
                    && targetChildNodes[i + 1]?.textContent.match(/[01]{8}/)
                ) return;
                console.log(nodeText);
                target.appendChild(
                    new Text(
                        nodeText.replace(/[01]{8}( ?[01]{8})*/, nodeText.match(/[01]{8}/g)?.map((e) => (
                            String.fromCharCode(Number.parseInt(e, 2))
                        ))?.join('')) || nodeText,
                    ),
                );
            } else {
                target.appendChild(node);
            }
        });
    };

    const undoListener = ({ target }) => {


        console.log(target.targetChildNodes);
        if (target.targetChildNodes) {
            // target.childNodes = target.targetChildNodes;
            target.innerHTML = '';
            target.targetChildNodes.forEach((node) => target.appendChild(node));
        }
    }

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
}());
