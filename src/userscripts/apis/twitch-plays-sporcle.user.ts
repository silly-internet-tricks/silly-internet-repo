// ==UserScript==
// @name         Twitch Plays Sporcle
// @namespace    http://tampermonkey.net/
// @version      2024-05-30
// @description  Let the twitch chat guess sporcle answers
// @author       Josh Parker
// @match        https://www.sporcle.com/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sporcle.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// NOTE: this is only intended to work with sporcle quizzes
//       where you fill the answers in in a text box
//       (for now)

import fillInputElement from '../../lib/util/fill-input-element';
import getTwitchChatMessage from '../../lib/apis/get-twitch-chat-message';

(function twitchPlaysSporcle() {
 getTwitchChatMessage((chunk) => {
  fillInputElement(document.getElementById('gameinput') as HTMLInputElement, chunk);
 });
})();
