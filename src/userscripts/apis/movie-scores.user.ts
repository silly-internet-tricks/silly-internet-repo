// ==UserScript==
// @name         Movie Scores
// @namespace    http://tampermonkey.net/
// @version      2024-05-18
// @description  Display rotten tomatoes and imdb scores anywhere
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rottentomatoes.com
// @grant        GM_xmlhttpRequest
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/movie-scores.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/53cfea7803b0f4c0b905f8560c48abd2/raw/movie-scores.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/53cfea7803b0f4c0b905f8560c48abd2/raw/movie-scores.meta.js
// ==/UserScript==

(function movieScores() {
 /*
 note for tomato graphic:
 background-image: url(/assets/pizza-pie/images/icons/tomatometer/tomatometer-fresh.149b5e8adc3.svg);
 */

 // other steps for this one.
 // 1. at least also show the imdb user rating
 // 2. show the poster and tomato graphic from rotten tomatoes
 //   a. we want to edit these into the page where the text was selected.
 //   b. so, create an element or elements from the selection, where the poster and graphic can be shown
 // 3. OR ALTERNATIVELY: just show a card, like with the pokemon one.

 const parser = new DOMParser();
 const decoder = new TextDecoder();
 document.addEventListener('keydown', ({ code }) => {
  if (code === 'NumpadMultiply') {
   const title = window.getSelection().toString();

   GM.xmlHttpRequest({
    url: `https://www.rottentomatoes.com/search?search=${title}`,
    responseType: 'arraybuffer',
   }).then((t): void => {
    const dom = parser.parseFromString(decoder.decode(t.response), 'text/html');
    console.log(dom);
    const searchPageMediaRows = [...dom.querySelectorAll('search-page-result search-page-media-row')];
    console.log(searchPageMediaRows);
    const tomatometers = searchPageMediaRows.map((e) => Number(e.getAttribute('tomatometerscore')));
    console.log(tomatometers);
    const maxTomatometer = Math.max(...tomatometers);
    console.log(maxTomatometer);
    const maxTitle = searchPageMediaRows.find(
     (e) => Number(e.getAttribute('tomatometerscore')) === maxTomatometer,
    );

    console.log(maxTitle);
   });
  }
 });
})();
