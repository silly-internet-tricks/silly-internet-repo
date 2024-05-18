// ==UserScript==
// @name         Movie Scores
// @namespace    http://tampermonkey.net/
// @version      2024-05-18
// @description  Display rotten tomatoes and imdb scores anywhere
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rottentomatoes.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function movieScores() {
 /*
 note for tomato graphic:
 background-image: url(/assets/pizza-pie/images/icons/tomatometer/tomatometer-fresh.149b5e8adc3.svg);
 */
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
