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

const nextQuiz = (waitTimeSeconds: number) => {
 const nextQuizLink = pick([
  ...document.querySelectorAll('a[href^="/games"]:not([href*=category]):not([href*=tags])'),
 ]) as HTMLAnchorElement;

 toast(`Next quiz in ${waitTimeSeconds} seconds: ${nextQuizLink.textContent}`);
 const redBar = document.createElement('div');
 const greenBar = document.createElement('div');
 redBar.classList.add('countdown-timer-bar');
 greenBar.classList.add('countdown-timer-bar');
 greenBar.classList.add('counting-down');
 document.body.appendChild(redBar);
 document.body.appendChild(greenBar);

 setTimeout(() => {
  nextQuizLink.click();
 }, 1000 * waitTimeSeconds);
};

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

.countdown-timer-bar {
 position: fixed;
 top: 0;
 left: 0;
 right: 0;
 height: 9dvh;
 background-color: red;
 border: 0.25rem solid black;
}

div.counting-down {
 background-color: green;
 animation-name: countdown-timer;
 animation-duration: 15s;
 animation-timing-function: linear;
 animation-iteration-count: 1;
 animation-fill-mode: forwards;
 transform-origin: top left;
}

@keyframes countdown-timer {
 0% {
  transform: scaleX(0%);
 }

 100% {
  transform: scaleX(100%);
 }
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
 });

 try {
  mo.observe(sporcleScore, { childList: true });
 } catch (e) {
  console.error(e);
  console.error('it seems that this game does not have a score box!');
  console.error("please check it out. If it is an unsupported quiz type, it's probably fine for now");
 }

 const postGameBox = document.querySelector('div#postGameBox');

 const gameOverMo = new MutationObserver((mutationRecords) => {
  console.log(mutationRecords);
  if (mutationRecords[0].attributeName !== 'style') {
   console.error('observed an unexpected mutation!');
   console.error(mutationRecords);
   throw 'Please look at the unexpected mutation! 🕵️';
  }

  nextQuiz(15);
 });

 gameOverMo.observe(postGameBox, { attributes: true });

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

 const gameTable = document.querySelector('table#gameTable');

 if (!gameTable) {
  // TODO: see if we can find ways to show player names by answers in game types where the game table does not exist.
  console.warn('The game table does not exist. Player names will not be shown by answers.');
 } else {
  tableMo.observe(gameTable, { subtree: true, childList: true });
 }

 getTwitchChatMessage((message, username) => {
  mostRecentUsername = username;
  input.value = '';
  fillInputElement(input, message);
 });

 // TODO: Maybe support grid type in the future?
 const validQuizTypes = ['classic', 'map', 'picturebox', 'slideshow'];
 const invalidQuizTypes = ['pictureclick', 'clickable', 'grid', 'multiplechoice', 'orderup'];

 setTimeout(() => {
  const gameTypeIcon = document.querySelector('.game-type .game-type-icon');

  const gameIsInvalid = invalidQuizTypes.some((type) => gameTypeIcon.classList.contains(type));

  const gameIsValid = validQuizTypes.some((type) => gameTypeIcon.classList.contains(type));

  if (gameIsInvalid === gameIsValid) {
   console.error(gameTypeIcon);
   throw 'Hey! 😭 The game type was something unexpected! Please check it out.';
  }

  if (gameIsInvalid) {
   toast('Whoops! This game type is unsupported. Moving on in two seconds...');
   nextQuiz(2);
  }

  const playButton = document.querySelector('button#button-play') as HTMLButtonElement;
  playButton.click();

  // now let's set a ten second interval to alternately scroll to the top and bottom of the div#quiz-area
  const quizArea = document.querySelector('div#quiz-area') as HTMLDivElement;
  const stickyGameHeaderWrapper = document.querySelector('div#gameHeaderWrapper') as HTMLDivElement;
  let lastScroll = 0;
  setInterval(() => {
   // NOTE: I am assuming here that the quizArea.offsetTop will not change.
   if (lastScroll < quizArea.offsetTop) {
    quizArea.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    lastScroll = quizArea.offsetTop;
   } else {
    const effectiveInnerHeight = window.innerHeight - stickyGameHeaderWrapper.offsetHeight;
    const maxScroll = quizArea.offsetTop + quizArea.offsetHeight - effectiveInnerHeight;
    const nextScroll = lastScroll + effectiveInnerHeight;
    if (nextScroll < maxScroll) {
     window.scroll({ top: nextScroll, behavior: 'smooth' });
     lastScroll = nextScroll;
    } else {
     quizArea.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
     lastScroll = 0;
    }
   }
  }, 10000);
 }, 2000);
})();
