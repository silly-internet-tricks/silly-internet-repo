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
// import generalAnimationifier from '../../lib/effects/general-animation-ifier';
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
 /*
 const headCode = (family: string) => `
 <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${family.replace(
  /\s+/,
  '+',
 )}:ital@0;1&display=swap" rel="stylesheet">
 `;
*/
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
  console.log(' i have a key 😍 ');
  fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${key}`)
   .then((r) => r.json())
   .then((j) => {
    console.log(j);

    interface Font {
     family: string;
    }
    const { items } = j;
    // steps:
    // one: show a dropdown with the list of fonts
    let selectedFont;
    parameterForm(
     'google-fonts',
     new Map<string, string[]>([['font', items.map((font: Font) => font.family)]]),
     (parameterLabel, parameterValue: string) => {
      selectedFont = items.find((font: Font) => font.family === parameterValue);
      console.log(selectedFont);
     },
    );

    // two: put the font style on an element using the effects techniques
   });
 });
})();
