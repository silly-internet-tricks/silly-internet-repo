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
import toast from '../../lib/util/toast';

// ISSUE: it occasionally fails when the show twitch chat usercript is disabled
//        (maybe only the first time)
(function twitchPlaysSporcle() {
 const input = document.getElementById('gameinput') as HTMLInputElement;
 let mostRecentUsername: string;
 const score = new Map<string, number>();
 const sporcleScore = document.querySelector('#scoreBox > .currentScore');
 const mo = new MutationObserver(() => {
  if (score.has(mostRecentUsername)) score.set(mostRecentUsername, score.get(mostRecentUsername) + 1);
  else score.set(mostRecentUsername, 1);
  console.log(score);
  toast(`${mostRecentUsername} has ${score.get(mostRecentUsername)} points!`);
 });

 mo.observe(sporcleScore, { childList: true });

 getTwitchChatMessage((message, username) => {
  mostRecentUsername = username;
  input.value = '';
  fillInputElement(input, message);
 });
})();
