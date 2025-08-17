// ==UserScript==
// @name         Use Google Font
// @namespace    http://tampermonkey.net/
// @version      2024-05-24
// @description  Change the font to the google font of our choice
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/google-font.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/fffbe09f34dea576abe8b1507f3ff4d7/raw/google-font.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/fffbe09f34dea576abe8b1507f3ff4d7/raw/google-font.meta.js
// ==/UserScript==

import insertCSS from '../../lib/util/insert-css';
import holdKeyAndClickWithUndo from '../../lib/util/hold-key-and-click-with-undo';
import parameterForm from '../../lib/util/parameter-form';

(function useGoogleFont() {
 const gmKey = 'google-font-api-key';

 insertCSS(`
 #google-font-api-key {
  position: fixed;
  z-index: 11111;
  inset: 0;
 }
 `);

 const families = new Set<string>();

 const insertHeadCode = (family: string, regular: string) =>
  insertCSS(`
     @font-face {
      font-family: '${family}';
      src: url(${regular});
    }`);

 const promptForKey = () =>
  new Promise((solve) => {
   const oldKey = GM_getValue(gmKey);
   if (oldKey && oldKey !== 'idk') {
    solve(oldKey);
    return;
   }

   const input = document.createElement('input');
   input.id = 'google-font-api-key';
   input.placeholder = 'paste the api key here and press enter';
   input.addEventListener('keypress', ({ key }) => {
    if (key === 'Enter') {
     input.parentNode.removeChild(input);
     GM_setValue(gmKey, input.value);
     solve(input.value);
    }
   });

   document.body.appendChild(input);
  });

 promptForKey().then((key) => {
  GM.xmlHttpRequest({
   url: `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=popularity`,
   method: 'GET',
   responseType: 'json',
  })
   .then((j) => {
    interface Font {
     family: string;
     files: {
      regular: string;
     };
    }

    const { items } = j.response;
    let selectedFont: Font;
    parameterForm(
     'google-fonts',
     new Map<string, string[]>([['font', items.map((font: Font) => font.family)]]),
     (parameterLabel, parameterValue: string) => {
      selectedFont = items.find((font: Font) => font.family === parameterValue);
      console.log(selectedFont);
     },
    );

    holdKeyAndClickWithUndo(
     {
      do: ({ target }) => {
       // special case for https://news.google.com/*
       if (
        window.location.href.match(/https:\/\/news\.google\.com\/.*/) &&
        [...document.querySelectorAll('main a')].find((e) => e === target)
       ) {
        if (target instanceof HTMLElement) target = target.parentElement.parentElement;
       }

       const {
        family,
        files: { regular },
       } = selectedFont;
       if (!families.has(family)) {
        insertHeadCode(family, regular);
       }

       if (target instanceof HTMLElement) {
        if (target.style.getPropertyValue('font-family')) {
         target.setAttribute('old-inline-font-family', target.style.getPropertyValue('font-family'));
        }

        target.style.setProperty('font-family', `"${family}"`);
       }
      },
      undo: ({ target }) => {
       if (target instanceof HTMLElement) {
        if (target.getAttribute('old-inline-font-family')) {
         target.style.setProperty('font-family', target.getAttribute('font-family'));
        } else {
         target.style.removeProperty('font-family');
        }
       }
      },
     },
     'google-font',
    );
   })
   .catch((e) => {
    console.error(e);
   });
 });
})();
