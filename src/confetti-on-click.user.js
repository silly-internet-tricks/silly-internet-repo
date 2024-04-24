// ==UserScript==
// @name         Confetti On Click
// @namespace    http://tampermonkey.net/
// @version      2024-04-24
// @description  show confetti (from the awesome canvas-confetti library) wherever you click!
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jsdelivr.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/confetti-on-click.user.js
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/4e8ef94816a1da701962aa42b8857e47/raw/confetti-on-click.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/4e8ef94816a1da701962aa42b8857e47/raw/confetti-on-click.meta.js
// ==/UserScript==

(function confettiOnClick() {
 document.addEventListener('click', ({ x, y }) => {
  // eslint-disable-next-line no-undef
  confetti({
   origin: {
    x: x / window.innerWidth,
    y: y / window.innerHeight,
   },
   particleCount: 100,
   spread: 360,
  });
 });
}());
