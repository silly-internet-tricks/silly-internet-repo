// ==UserScript==
// @name         Show Twitch Chat
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Show twitch chat no matter what website you're looking at (no external dependencies)
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      localhost
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/toast-twitch-chat.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/9b6d4a20dcf00cddd53ac1392aabc5f0/raw/toast-twitch-chat.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/9b6d4a20dcf00cddd53ac1392aabc5f0/raw/toast-twitch-chat.meta.js
// @noframes
// ==/UserScript==

import getTwitchChatMessage from '../../lib/apis/get-twitch-chat-message';
import toast from '../../lib/util/toast';

// TODO: try showing emotes as mentioned at https://dev.twitch.tv/docs/irc/emotes/#getting-channel-emotes
(function subscribeTwitchChat() {
 getTwitchChatMessage((message, username) => {
  toast(`${username}: ${message}`);
 });
})();
