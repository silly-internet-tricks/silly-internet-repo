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
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/binary-bot-translator.user.js
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/0e9116c846c15f19b39e04a651345bdc/raw/binary-bot-translator.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/0e9116c846c15f19b39e04a651345bdc/raw/binary-bot-translator.meta.js
// ==/UserScript==
(function binaryBotTranslator() {
    var clickEventListener = function clickEventListener(event) {
        var target = event.target;
        if (!target)
            throw new Error("".concat(target, " is expected to be truthy"));
        if (!target.nodeType)
            throw new Error("".concat(target, " is expected to be a Node"));
        if (!target.tagName)
            throw new Error("".concat(target, " is expected to be an Element"));
        var targetChildNodes = target.childNodes;
        target.innerHTML = '';
        // @ts-expect-error: this is a property I dynamically add to the element in order to access it later
        target['target-child-nodes'] = targetChildNodes;
        targetChildNodes.forEach(function (node, i) {
            var _a, _b, _c, _d, _e, _f, _g;
            if (node.nodeName === '#text') {
                if (node.textContent === null)
                    throw new Error("text node ".concat(node, " was expected to have text content!"));
                var nodeText = node.textContent;
                if (nodeText === ' '
                    && ((_a = targetChildNodes[i - 1]) === null || _a === void 0 ? void 0 : _a.nodeName) === '#text'
                    && ((_b = targetChildNodes[i + 1]) === null || _b === void 0 ? void 0 : _b.nodeName) === '#text'
                    && ((_d = (_c = targetChildNodes[i - 1]) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.match(/[01]{8}/))
                    && ((_f = (_e = targetChildNodes[i + 1]) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.match(/[01]{8}/)))
                    return;
                console.log(nodeText);
                var binaryRegExpPattern = /[01]{8}( ?[01]{8})*/;
                var translatedBinary = nodeText.match(binaryRegExpPattern);
                if (translatedBinary === null) {
                    target.appendChild(new Text(nodeText));
                }
                else {
                    // TODO: check for the case where there is more than one run of bytes in a single text node
                    target.appendChild(new Text(nodeText.replace(binaryRegExpPattern, (_g = translatedBinary[0].split(' ').map(function (e) { return (String.fromCharCode(Number.parseInt(e, 2))); })) === null || _g === void 0 ? void 0 : _g.join(''))));
                }
            }
            else {
                target.appendChild(node);
            }
        });
    };
    var undoListener = function (event) {
        var target = event.target;
        if (!target)
            throw new Error("".concat(target, " is expected to be truthy"));
        if (!target.nodeType)
            throw new Error("".concat(target, " is expected to be a Node"));
        if (!target.tagName)
            throw new Error("".concat(target, " is expected to be an Element"));
        // @ts-expect-error: this is a property I dynamically add to the element in order to access it later
        var targetChildNodes = target['target-child-nodes'];
        console.log(targetChildNodes);
        if (targetChildNodes) {
            target.innerHTML = '';
            targetChildNodes.forEach(function (node) { return target.appendChild(node); });
        }
    };
    document.addEventListener('keydown', function (_a) {
        var code = _a.code;
        if (code === 'KeyB') {
            document.body.addEventListener('click', clickEventListener);
        }
        if (code === 'KeyZ') {
            document.body.addEventListener('click', undoListener);
        }
    });
    document.addEventListener('keyup', function (_a) {
        var code = _a.code;
        if (code === 'KeyB') {
            document.body.removeEventListener('click', clickEventListener);
        }
        if (code === 'KeyZ') {
            document.body.removeEventListener('click', undoListener);
        }
    });
}());
