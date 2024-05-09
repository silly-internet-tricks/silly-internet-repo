// ==UserScript==
// @name         Search Wikipedia Everywhere
// @namespace    http://tampermonkey.net/
// @version      2024-05-01
// @description  Search english wikipedia for whichever text you select anywhere, and display the first article from the results
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        GM_xmlhttpRequest
// @connect      en.wikipedia.org
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/search-wikipedia-everywhere.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/9e1271d6d8f950fb5cd5037b15d7e746/raw/search-wikipedia-everywhere.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/9e1271d6d8f950fb5cd5037b15d7e746/raw/search-wikipedia-everywhere.meta.js
// ==/UserScript==

import insertCSS from '../../lib/util/insert-css';

(function searchWikipediaEverywhere() {
 insertCSS(`
  div#wiki-area {
    position: fixed;
    background-color: white;
    top: 0;
    left: 0;
    height: fit-content;
    max-height: 30dvh;
    width: fit-content;
    padding: 1em;
    z-index: 701;
    overflow-y: auto;
    box-shadow: 1px 3px 8px #FF007F;
}

p.error-message {
    color: red;
    font-weight: bold;
}

button.clear {
  float: right;
  padding: 1em;
  background-color: lightgray;
  box-shadow: 1px 1px 1px black;
  cursor: pointer;
}
`);

 const selector: string =
  'main#content > header > h1,div#mw-content-text > div.mw-parser-output > p,div#mw-content-text > div.mw-parser-output > ul,div#mw-content-text > div.mw-parser-output > h2,div#mw-content-text > div.mw-parser-output > h3,div#mw-content-text > div.mw-parser-output > div.reflist,div#mw-content-text > div.mw-parser-output > div.refbegin,div#mw-content-text > div.mw-parser-output > table.wikitable';

 const wikiArea: HTMLElement = document.createElement('div');
 wikiArea.id = 'wiki-area';
 document.body.appendChild(wikiArea);

 const parser: DOMParser = new DOMParser();

 document.addEventListener('keypress', ({ code }) => {
  if (code === 'KeyW') {
   const mySearchQuery: string = window.getSelection().toString().trim();
   if (mySearchQuery.length === 0) {
    return;
   }

   const searchRequestOptions: GmXmlHttpRequestRequestOptions = {
    url: `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${mySearchQuery.substring(0, 300)}&limit=1`,
    responseType: 'json',
   };

   // @ts-expect-error GM is defined as part of the API for the tampermonkey chrome extension
   GM.xmlHttpRequest(searchRequestOptions).then((r) => {
    if (r.response.pages.length === 0) {
     const errorMessage: HTMLElement = document.createElement('p');
     errorMessage.classList.add('error-message');
     errorMessage.appendChild(new Text(`No search results from wikipedia! (query: ${mySearchQuery})`));
     wikiArea.appendChild(errorMessage);
     return;
    }

    const { key } = r.response.pages[0];
    const requestOptions: GmXmlHttpRequestRequestOptions = {
     url: `https://en.wikipedia.org/wiki/${key}`,
     responseType: 'text',
    };

    // @ts-expect-error GM is defined as part of the API for the tampermonkey chrome extension
    GM.xmlHttpRequest(requestOptions).then((t) => {
     const dom: Document = parser.parseFromString(t.response, 'text/html');
     const wikiPartsWithNav: HTMLElement[] = [...dom.querySelectorAll(selector)] as HTMLElement[];
     const wikiParts: HTMLElement[] = wikiPartsWithNav.filter(
      (e) => !(e.tagName === 'UL' && e.getAttribute('role') === 'navigation'),
     );

     wikiArea.innerHTML = '';
     const clearButton: HTMLButtonElement = document.createElement('button');
     clearButton.appendChild(new Text('clear'));
     clearButton.classList.add('clear');
     clearButton.addEventListener('click', () => {
      // TODO: add a way to undo the clear
      wikiArea.innerHTML = '';
     });

     wikiArea.appendChild(clearButton);
     wikiParts.forEach((e) => wikiArea.appendChild(e));
    });
   });
  }
 });
})();
