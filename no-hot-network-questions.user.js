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
// ==/UserScript==
import insertCSS from './insert-css';

(function noHotNetworkQuestions() {
  insertCSS(`
div#hot-network-questions {
    display: none;
}
    `);
}());
