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
import pick from '../../lib/util/pick';
import insertCSS from '../../lib/util/insert-css';

// ISSUE: it occasionally fails when the show twitch chat usercript is enabled
//        (maybe only the first time)
(function twitchPlaysSporcle() {
 insertCSS(`
span.correct-answer-twitch-username {
 color: #FF003F;
 font-weight: 900;
}
 
span.correct-answer-twitch {
 display: inline-block;
 background-color: rgba(100, 140, 220, 0.3);
 border-radius: 0.3rem;
 padding: 0.15rem;
 margin: 0;
 font-size: 0.6rem;
 font-family: monospace;
}
 `);

 const input = document.getElementById('gameinput') as HTMLInputElement;
 let mostRecentUsername: string;
 const score = new Map<string, number>();
 const sporcleScore = document.querySelector('#scoreBox > .currentScore');
 const mo = new MutationObserver(() => {
  if (score.has(mostRecentUsername)) {
   score.set(mostRecentUsername, score.get(mostRecentUsername) + 1);
  } else {
   score.set(mostRecentUsername, 1);
  }

  toast(`${mostRecentUsername} has ${score.get(mostRecentUsername)} points!`);

  setTimeout(() => {
   const gameOverMessage = document.querySelector('div#gameOverMsg');
   if (gameOverMessage.checkVisibility()) {
    const nextQuiz = pick([
     ...document.querySelectorAll('a[href^="/games"]:not([href*=category])'),
    ]) as HTMLAnchorElement;

    toast(`Next quiz in 15 seconds: ${nextQuiz.textContent}`);
    setTimeout(() => {
     nextQuiz.click();
    }, 15000);
   }
  }, 1000);
 });

 mo.observe(sporcleScore, { childList: true });

 // observe the table for added correct answers
 // one for the entire table (for efficiency's sake)
 const tableMo = new MutationObserver((mutationRecords) => {
  if (mutationRecords.length !== 1) {
   console.error('mutationRecords');
   console.error(mutationRecords);
   throw 'Please take a look at this unexpected result';
  }

  if (mutationRecords[0].removedNodes.length !== 1) {
   return;
  }

  if (mutationRecords[0].removedNodes[0].textContent.match(/\S/)) {
   console.log(mutationRecords[0].removedNodes[0].textContent);
   console.log('no further action necessary');
   return;
  }

  const span = document.createElement('span');
  // Could this go wrong if another answer has come in before the table cell gets filled?
  // (I doubt it because I believe the table cell gets filled nearly instantaneously)
  span.appendChild(new Text(mostRecentUsername));
  span.classList.add('correct-answer-twitch-username');

  const outerSpan = document.createElement('span');
  outerSpan.appendChild(new Text('Answered by: '));
  outerSpan.appendChild(span);
  outerSpan.classList.add('correct-answer-twitch');
  mutationRecords[0].target.appendChild(outerSpan);
 });

 tableMo.observe(document.querySelector('table#gameTable'), { subtree: true, childList: true });

 getTwitchChatMessage((message, username) => {
  mostRecentUsername = username;
  input.value = '';
  fillInputElement(input, message);
 });
})();
