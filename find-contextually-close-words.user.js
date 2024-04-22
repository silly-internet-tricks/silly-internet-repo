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
  const insertCSS = function insertCSS(css) {
    const style = document.createElement('style');
    style.appendChild(new Text(css));
    document.body.appendChild(style);
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

        // TODO: this should be in its own function
        const p = document.createElement('p');
        p.classList.add('josh');
        p.appendChild(new Text(`distance: ${distance} game number: ${gameNumber}`));
        document.body.appendChild(p);

        return Promise.all(new Array(30).fill().map((_, i) => (
          fetch(`https://api.contexto.me/machado/en/tip/${gameNumber}/${i}`)
            .then((r) => r.json())
        )));
      })
      .catch((r) => {
        const p = document.createElement('p');
        p.classList.add('josh');
        p.classList.add('josh-error');
        p.appendChild(new Text(`error: ${r.status}`));
        document.body.appendChild(p);
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

  const input = document.createElement('input');
  const button = document.createElement('button');
  input.classList.add('josh');
  button.classList.add('josh');
  button.appendChild(new Text('click me'));
  document.body.appendChild(input);
  document.body.appendChild(button);
  button.addEventListener('click', () => {
    seeContextuallyCloseWords(input.value)
      .then((contextuallyCloseWords) => contextuallyCloseWords.forEach(({ word }) => {
        const p = document.createElement('p');
        p.classList.add('josh');
        p.appendChild(new Text(word));
        document.body.appendChild(p);
      }));
  });
}());
