// ==UserScript==
// @name         Highlight On Hover
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Just highlight whatever element I point at
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/highlight-on-hover.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/18abb8c8c183817367e63d5ecc400c9c/raw/highlight-on-hover.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/18abb8c8c183817367e63d5ecc400c9c/raw/highlight-on-hover.meta.js
// ==/UserScript==

import highlightElement from './highlight-element';

(function insertChaosCode() {
 highlightElement().startHighlighting();
})();
