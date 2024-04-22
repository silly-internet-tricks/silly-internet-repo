// ==UserScript==
// @name         Find Contextually Close Words
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Get the contexto.me contextually close words for whatever word
// @author       Josh Parker
// @match        https://contexto.me/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=contexto.me
// @grant        none
// ==/UserScript==

(function findContextuallyCloseWords() {
  const div = document.createElement('div');

  const insertCSS = function insertCSS(css) {
    const style = document.createElement('style');
    style.appendChild(new Text(css));
    document.body.appendChild(style);
  };

  const insertContentElement = function insertContentElement(tagName, classes, text = '', parentNode = document.body) {
    const element = document.createElement(tagName);
    classes.forEach((c) => element.classList.add(c));
    element.appendChild(new Text(text));
    parentNode.appendChild(element);
    return element;
  };

  const fetchThatRejectsWhenNotOkay = function fetchThatRejectsWhenNotOkay(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((r) => {
          if (r.ok) resolve(r);
          else reject(r);
        });
    });
  };

  const guess = (gameNumber, word) => (
    fetchThatRejectsWhenNotOkay(`https://api.contexto.me/machado/en/game/${gameNumber}/${word}`)
  ).then((r) => r.json());

  const seeContextuallyCloseWords = function seeContextuallyCloseWords(word) {
    return Promise.all(new Array(500).fill().map((_, i) => guess(i, word)))
      .then((guesses) => {
        const sortedGuesses = guesses.map((e, i) => (
          { ...e, gameNumber: i }
        )).sort((b, a) => b.distance - a.distance);

        const { gameNumber, distance } = sortedGuesses[0];

        div.innerHTML = '';
        insertContentElement('p', ['josh'], `distance: ${distance} game number: ${gameNumber}`, div);

        return Promise.all(new Array(30).fill().map((_, i) => (
          fetch(`https://api.contexto.me/machado/en/tip/${gameNumber}/${i}`)
            .then((r) => r.json())
        )));
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

  const input = insertContentElement('input', ['josh']);

  insertContentElement('button', ['josh'], 'click me').addEventListener('click', ({ target }) => {
    target.disabled = true;
    seeContextuallyCloseWords(input.value)
      .then((contextuallyCloseWords) => contextuallyCloseWords.forEach(({ word }) => {
        insertContentElement('p', ['josh'], word, div);
      }))
      .then(() => { target.disabled = false; })
      .catch((r) => {
        div.innerHTML = '';
        insertContentElement('p', ['josh', 'josh-error'], `error: ${r.status} (on word ${input.value})`, div);
        target.disabled = false;
      });
  });

  document.body.appendChild(div);
}());
