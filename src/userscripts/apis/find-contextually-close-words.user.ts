// ==UserScript==
// @name         Find Contextually Close Words
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Get the contexto.me contextually close words for whatever word
// @author       Josh Parker
// @match        https://contexto.me/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=contexto.me
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/find-contextually-close-words.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/4f2dd2ef174d4ed8661acfff7130cec0/raw/find-contextually-close-words.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/4f2dd2ef174d4ed8661acfff7130cec0/raw/find-contextually-close-words.meta.js
// ==/UserScript==

(function findContextuallyCloseWords() {
 const div: Element = document.createElement('div');

 const insertCSS: (css: string) => void = function insertCSS(css) {
  const style: Element = document.createElement('style');
  style.appendChild(new Text(css));
  document.body.appendChild(style);
 };

 const insertContentElement: (
  tagName: string,
  classes: string[],
  text?: string,
  parentNode?: Element,
 ) => Element = function insertContentElement(tagName, classes, text = '', parentNode = document.body) {
  const element: Element = document.createElement(tagName);
  classes.forEach((c) => element.classList.add(c));
  element.appendChild(new Text(text));
  parentNode.appendChild(element);
  return element;
 };

 type FetchThatRejectsWhenNotOkay = (url: string) => Promise<Response>;
 const fetchThatRejectsWhenNotOkay: FetchThatRejectsWhenNotOkay = function fetchThatRejectsWhenNotOkay(url) {
  return new Promise((resolve, reject) => {
   fetch(url).then((r) => {
    if (r.ok) resolve(r);
    else reject(r);
   });
  });
 };

 type Guess = (gameNumber: number, word: string) => Promise<{ distance: number }>;
 // TODO: maybe define the object that comes back from contexto api ????
 const guess: Guess = function guess(gameNumber, word) {
  const url: string = `https://api.contexto.me/machado/en/game/${gameNumber}/${word}`;
  return fetchThatRejectsWhenNotOkay(url).then((r) => r.json());
 };

 type FetchTips = (word: string) => Promise<unknown[]>;
 const fetchTips: FetchTips = function fetchTips(word) {
  return Promise.all(new Array(500).fill(undefined).map((_, i) => guess(i, word))).then((guesses) => {
   const sortedGuesses: { distance: number; gameNumber: number }[] = guesses
    .map((e, i) => ({ ...e, gameNumber: i }))
    .sort((b, a) => b.distance - a.distance);

   const { gameNumber, distance } = sortedGuesses[0];

   div.innerHTML = '';
   insertContentElement('p', ['josh'], `distance: ${distance} game number: ${gameNumber}`, div);

   type FetchTip = (_: unknown, i: number) => Promise<unknown>;
   const fetchTip: FetchTip = function fetchTip(_, i) {
    return fetch(`https://api.contexto.me/machado/en/tip/${gameNumber}/${i}`).then((r) => r.json());
   };

   return Promise.all(new Array(30).fill(undefined).map(fetchTip));
  });
 };

 insertCSS(`
  .josh {
    margin: 2em;
  }
  .josh-error {
    color: red;
  }
  .josh-error::before {
    content: '😡😲';
  }
  `);

 const input: HTMLInputElement = insertContentElement('input', ['josh']) as HTMLInputElement;

 insertContentElement('button', ['josh'], 'click me').addEventListener('click', ({ target }) => {
  const button: HTMLButtonElement = target as HTMLButtonElement;
  button.disabled = true;

  interface Word {
   word: string;
  }
  const insertWords: (words: Word[]) => void = function insertWords(words) {
   words.forEach(({ word }) => {
    insertContentElement('p', ['josh'], word, div);
   });
  };

  fetchTips(input.value)
   .then(insertWords)
   .then(() => {
    // TODO: should we consider doing something else?
    button.disabled = false;
   })
   .catch((r) => {
    div.innerHTML = '';
    insertContentElement('p', ['josh', 'josh-error'], `error: ${r.status} (on word ${input.value})`, div);
    button.disabled = false;
   });
 });

 document.body.appendChild(div);
})();
