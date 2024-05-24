// ==UserScript==
// @name         Use Google Font
// @namespace    http://tampermonkey.net/
// @version      2024-05-24
// @description  Change the font to the google font of our choice
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setValue
// @grant        GM_getValue
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

 const insertHeadCode = (family: string) => {
  const stylesheet = document.createElement('link');
  stylesheet.setAttribute('rel', 'stylesheet');
  stylesheet.setAttribute('href', `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/, '+')}`);
  document.head.appendChild(stylesheet);
 };

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
  fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=popularity`)
   .then((r) => r.json())
   .then((j) => {
    interface Font {
     family: string;
    }

    const { items } = j;
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
       if (target instanceof HTMLElement) {
        const { family } = selectedFont;
        if (!families.has(family)) {
         insertHeadCode(family);
        }

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
