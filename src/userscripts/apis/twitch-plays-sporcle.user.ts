// ==UserScript==
// @name         Twitch Plays Sporcle
// @namespace    http://tampermonkey.net/
// @version      2024-05-30
// @description  Let the twitch chat guess sporcle answers
// @author       Josh Parker
// @match        https://www.sporcle.com/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sporcle.com
// @grant        GM_xmlhttpRequest
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/twitch-plays-sporcle.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/44b414bf53792ab5cb5328b0f5f2463c/raw/twitch-plays-sporcle.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/44b414bf53792ab5cb5328b0f5f2463c/raw/twitch-plays-sporcle.meta.js
// ==/UserScript==

// NOTE: this is only intended to work with sporcle quizzes
//       where you fill the answers in in a text box
//       (for now)

import fillInputElement from '../../lib/util/fill-input-element';
import getTwitchChatMessage from '../../lib/apis/get-twitch-chat-message';
import toast from '../../lib/util/toast';
import pick from '../../lib/util/pick';
import insertCSS from '../../lib/util/insert-css';
import { storeMap, retrieveMap } from '../../lib/util/store-map';
import { storeQueue, retrieveQueue } from '../../lib/util/store-queue';

const quizRequestQueueStorageKey = 'silly-internet-tricks-quiz-request-queue';
interface QuizRequest {
 title: string;
 link: string;
}

const quizIsInvalid = (dom: Document) => {
 // TODO: Maybe support grid type in the future?
 const validQuizTypes = ['classic', 'map', 'picturebox', 'slideshow'];
 const invalidQuizTypes = ['pictureclick', 'clickable', 'grid', 'multiplechoice', 'orderup'];

 const gameTypeIcon = dom.querySelector('.game-type .game-type-icon');

 const gameIsInvalid = invalidQuizTypes.some((type) => gameTypeIcon.classList.contains(type));

 const gameIsValid = validQuizTypes.some((type) => gameTypeIcon.classList.contains(type));

 if (gameIsInvalid === gameIsValid) {
  console.error(gameTypeIcon);
  throw 'Hey! 😭 The game type was something unexpected! Please check it out.';
 }

 return gameIsInvalid;
};

const fetchQuizForTypeAndTitle = async (quizHref: string) => {
 const parser = new DOMParser();
 const r = await fetch(quizHref);
 const html = await r.text();
 const dom = parser.parseFromString(html, 'text/html');
 const title = dom.querySelector('head title')?.textContent.trim().replace(/Quiz$/, '').trim();
 return { title, dom };
};

const chooseValidQuiz: (quizHrefSet: Set<string>) => Promise<QuizRequest> = async (
 quizHrefSet: Set<string>,
) => {
 if (quizHrefSet.size === 0) {
  throw 'no valid quizzes!';
 }

 const nextQuizHref = pick(quizHrefSet);

 const { title, dom } = await fetchQuizForTypeAndTitle(nextQuizHref);

 const notValid = quizIsInvalid(dom);
 if (notValid) {
  quizHrefSet.delete(nextQuizHref);
  return chooseValidQuiz(quizHrefSet);
 }

 return {
  link: nextQuizHref,
  title,
 };
};

const toastNextQuiz = (waitTimeSeconds: number, nextQuizTitle: string) => {
 toast(`Next quiz in ${waitTimeSeconds} seconds: ${nextQuizTitle}`);
 const redBar = document.createElement('div');
 const greenBar = document.createElement('div');
 redBar.classList.add('countdown-timer-bar');
 greenBar.classList.add('countdown-timer-bar');
 greenBar.classList.add('counting-down');
 document.body.appendChild(redBar);
 document.body.appendChild(greenBar);
};

const nextQuiz = async (waitTimeSeconds: number) => {
 // if there is a quiz on the queue, get that instead of getting a random one from the page
 const queue = retrieveQueue(quizRequestQueueStorageKey);
 if (queue.size() > 0) {
  const quizRequest = queue.dequeue() as QuizRequest;

  storeQueue(quizRequestQueueStorageKey, queue);

  toastNextQuiz(waitTimeSeconds, quizRequest.title);

  setTimeout(() => {
   window.location.assign(quizRequest.link);
  }, 1000 * waitTimeSeconds);

  return;
 }

 const nextQuizLink = pick([
  ...document.querySelectorAll(
   'a[href^="/games"]:not([href*=category]):not([href*=tags]):not([href*=result])',
  ),
 ]) as HTMLAnchorElement;

 const { dom, title } = await fetchQuizForTypeAndTitle(nextQuizLink.href);

 const notValid: boolean = quizIsInvalid(dom);

 if (notValid) {
  // NOTE: I haven't bothered to take the invalid quiz out of the set
  // this could cause the game to not work if there are no valid quizzes
  nextQuiz(waitTimeSeconds);
 } else {
  toastNextQuiz(waitTimeSeconds, title);

  setTimeout(() => {
   nextQuizLink.click();
  }, 1000 * waitTimeSeconds);
 }
};

const gameRequest: (gameQuery: string) => void = (() => {
 const gameRequestQueue = retrieveQueue(quizRequestQueueStorageKey);

 return (gameQuery: string) => {
  console.log('got game request', gameQuery);
  const parser = new DOMParser();
  const encodedQuery = encodeURIComponent(gameQuery);
  fetch(`https://www.sporcle.com/search/quizzes/?s=${encodedQuery}`)
   .then((r) => r.text())
   .then(async (h) => {
    const dom = parser.parseFromString(h, 'text/html');
    const gameNames = [...dom.querySelectorAll('a.gameName')] as HTMLAnchorElement[];
    const gameNameHrefSet = new Set(gameNames.map((e) => e.href));

    try {
     const nextGame = await chooseValidQuiz(gameNameHrefSet);
     const queuedGameRequest = nextGame;

     toast(`game added to queue: ${queuedGameRequest.title}`);

     gameRequestQueue.enqueue(queuedGameRequest);
     storeQueue(quizRequestQueueStorageKey, gameRequestQueue);
    } catch (e) {
     console.error(e);
     toast(`No valid quizzes found for query ${gameQuery}`);
     toast('(the valid quiz types are classic, map, picturebox, and slideshow)');
    }
   });
 };
})();

// ISSUE: it occasionally fails when the show twitch chat usercript is enabled
//        (maybe only the first time)
(function twitchPlaysSporcle() {
 const usernameColorsStorageKey = 'silly-internet-tricks-username-colors';
 const usernameAlltimeScoreStorageKey = 'silly-internet-tricks-username-alltime-score';
 const usernameColors = retrieveMap(usernameColorsStorageKey) as Map<string, string>;
 const usernameAlltimeScore = retrieveMap(usernameAlltimeScoreStorageKey) as Map<string, number>;
 const randomUsernameColor = () =>
  `hsl(${(Math.floor(Math.random() * 300) + 250) % 360}, ${(
   Math.round(Math.random() * 5000) / 100 +
   50
  ).toPrecision(4)}%, ${(Math.round(Math.random() * 2500) / 100 + 25).toPrecision(4)}%)`;

 insertCSS(`
span.correct-answer-twitch-username {
 font-weight: 900;
}
 
span.correct-answer-twitch {
 display: inline-block;
 background-color: rgba(190, 210, 240, 0.8);
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
 z-index: 101;
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

 if (input) input.style.setProperty('display', 'none');

 let mostRecentUsername: string;
 const score = new Map<string, number>();
 const sporcleScore = document.querySelector('#scoreBox > .currentScore');
 const mo = new MutationObserver(() => {
  if (score.has(mostRecentUsername)) {
   score.set(mostRecentUsername, score.get(mostRecentUsername) + 1);
  } else {
   score.set(mostRecentUsername, 1);
  }

  const alltimeScore = usernameAlltimeScore.get(mostRecentUsername);
  if (alltimeScore) {
   usernameAlltimeScore.set(mostRecentUsername, alltimeScore + 1);
  } else {
   usernameAlltimeScore.set(mostRecentUsername, 1);
  }

  storeMap(usernameAlltimeScoreStorageKey, usernameAlltimeScore);

  if (!usernameColors.has(mostRecentUsername)) {
   usernameColors.set(mostRecentUsername, randomUsernameColor());
   storeMap(usernameColorsStorageKey, usernameColors);
  }

  // TODO: consider whether we only want to toast all time milestones (for now I just toast it every time)
  toast(
   `${mostRecentUsername} has ${score.get(mostRecentUsername)} points! ${usernameAlltimeScore.get(
    mostRecentUsername,
   )} all time!`,
  );
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
   console.warn('mutation record had different number of removed nodes');
   console.log(mutationRecords[0].removedNodes);
   console.log(mutationRecords[0]);

   // It will be an added text node if sporcle is adding an answer.
   // If I am adding my span to the table, the node type will be different
   if (!(mutationRecords[0].addedNodes[0].nodeType === Node.TEXT_NODE)) return;
  }

  if (mutationRecords[0].removedNodes[0]?.textContent.match(/\S/)) {
   console.log(mutationRecords[0].removedNodes[0].textContent);
   console.log('no further action necessary');
   return;
  }

  const span = document.createElement('span');
  // Could this go wrong if another answer has come in before the table cell gets filled?
  // (I doubt it because I believe the table cell gets filled nearly instantaneously)
  span.appendChild(new Text(mostRecentUsername));
  span.classList.add('correct-answer-twitch-username');
  span.style.setProperty('color', usernameColors.get(mostRecentUsername));

  const outerSpan = document.createElement('span');

  // TODO: consider whether the text "answered by" is actually needed
  //       or whether the name alone might suffice
  outerSpan.appendChild(new Text('Answered by: '));
  outerSpan.appendChild(span);
  outerSpan.classList.add('correct-answer-twitch');
  mutationRecords[0].target.appendChild(outerSpan);
 });

 const playAreaSelector = 'div#mapcanvas,table#gameTable';

 // My assumption is that there will either be a map canvas or a game table or neither, but not both
 if (document.querySelectorAll(playAreaSelector).length > 1) {
  console.warn(
   'Hey! Listen! 🧚✨ There was more than one play area found! Please check it out and figure out why!',
  );
 }

 const playArea = document.querySelector(playAreaSelector);

 if (!playArea) {
  console.warn('The play area does not exist. Player names will not be shown by answers.');
 } else {
  tableMo.observe(playArea, { subtree: true, childList: true });
 }

 getTwitchChatMessage((message, username) => {
  if (message.startsWith('!sporcle')) {
   console.log(message);
   // bot utility commands section
   const command = message.replace(/^!sporcle/, '').trim();

   // TODO: consider refactoring this chain of if/else if
   if (command.startsWith('goto')) {
    // !sporcle goto <cell>
    // EXAMPLE: if the chatter sends the message: "!sporcle goto pakistan"
    //          then we will select the cell that says pakistan in the name (if any)
    const gotoTarget = command.replace(/^goto/, '').trim();

    // NOTE: For now, I am assuming that the goto target element will be a td.
    // I'll need to check whether it might be something else, depending on quiz type

    const names = [...document.querySelectorAll('td[id^=name]')] as HTMLTableCellElement[];
    names.find((e) => e.checkVisibility() && e.textContent.match(new RegExp(gotoTarget, 'i'))).click();
   } else if (command.startsWith('next')) {
    // !sporcle next
    const nextButton = document.querySelector('button#nextButton') as HTMLButtonElement;
    nextButton.click();
   } else if (command.startsWith('prev')) {
    // !sporcle prev
    const prevButton = document.querySelector('button#previousButton') as HTMLButtonElement;
    prevButton.click();
   } else if (command.startsWith('req')) {
    const requestedGame = command.replace(/^req(uest)?/, '').trim();
    gameRequest(requestedGame);
   } else if (command.startsWith('give up')) {
    const giveUpButton = document.querySelector('button#giveUp') as HTMLButtonElement;
    giveUpButton.click();
   }
  } else {
   // answering a quiz question section
   mostRecentUsername = username;

   input.value = '';
   fillInputElement(input, message);
  }
 });

 setTimeout(() => {
  if (quizIsInvalid(document)) {
   toast('Whoops! This game type is unsupported. Moving on in two seconds...');
   nextQuiz(2);
  }

  const playButton = document.querySelector('button#button-play') as HTMLButtonElement;
  playButton.click();

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
