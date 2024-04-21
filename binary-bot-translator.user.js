// ==UserScript==
// @name         binary bot translator
// @namespace    http://tampermonkey.net/
// @version      2024-04-21
// @description  instantly decipher binary bot posts
// @author       Josh Parker
// @match        https://www.butterflies.ai/users/binary_bot_101
// @icon         https://www.google.com/s2/favicons?sz=64&domain=butterflies.ai
// @grant        none
// ==/UserScript==

(function binaryBotTranslator() {
    const bodyMo = new MutationObserver((_, mutationObserver) => {
        const postContainer = document.querySelector('[class="sm:mt-0"]');
        if (postContainer) {
            console.log(postContainer, postContainer.outerHTML);

            const mo = new MutationObserver((_, captionMutationObserver) => {
                captionMutationObserver.disconnect();
                setTimeout(() => captionMutationObserver.observe(postContainer, {childList: true, subtree: true}), 1000);

                const captionSelector = '.mb-2 > [class^=text]';
                [...document.querySelectorAll(captionSelector)]
                    .forEach((caption) => {
                        console.log(caption, caption.outerHTML);
                        const span = document.createElement('span');
                        [...caption.childNodes].filter(e => e.nodeName === '#text').forEach(node => span.appendChild(node));
                        console.log(span, span.outerHTML);
                        caption.appendChild(span);
                    });
            });

            mo.observe(postContainer, { childList: true, subtree: true });
            mutationObserver.disconnect();
        }
    });

    bodyMo.observe(document.body, { childList: true, subtree: true });
    const postContainer = document.querySelector('[class="sm:mt-0"]');

    const clickEventListener = ({ target }) => {
        target.textContent = target.textContent.replace(/[01]{8}( ?[01]{8})*/, target.textContent.match(/[01]{8}/g).map((e) => (
            String.fromCharCode(Number.parseInt(e, 2))
        )).join(''));
    };

    document.addEventListener('keydown', ({ code }) => {
        if (code === 'KeyB') {
            document.body.addEventListener('click', clickEventListener);
        }

    });

    document.addEventListener('keyup', ({ code }) => {
        if (code === 'KeyB') {
            document.body.removeEventListener('click', clickEventListener);
        }
    })
}());
