// ==UserScript==
// @name         No Hot Network Questions
// @namespace    http://tampermonkey.net/
// @version      2024-04-21
// @description  Remove the distracting hot network questions
// @author       Josh Parker
// @match        https://askubuntu.com/*
// @match        https://stackoverflow.com/*
// @match        https://*.stackexchange.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=askubuntu.com
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/no-hot-network-questions.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/3596ef704dc4dbc137cbfe2778b2363a/raw/no-hot-network-questions.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/3596ef704dc4dbc137cbfe2778b2363a/raw/no-hot-network-questions.meta.js
// ==/UserScript==
import insertCSS from '../../lib/util/insert-css';

(function noHotNetworkQuestions() {
 insertCSS(`
div#hot-network-questions {
    display: none;
}
    `);
})();
