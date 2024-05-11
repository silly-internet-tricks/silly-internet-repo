// ==UserScript==
// @name         Emoji Substitutions
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  replace some words with their unicode emoji counterparts 😉
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/emoji-substitutions.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/52edbd6efc1d3ea14d201e3ab26e8f9f/raw/emoji-substitutions.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/52edbd6efc1d3ea14d201e3ab26e8f9f/raw/emoji-substitutions.meta.js
// ==/UserScript==

import generalTextEffectifier from '../../lib/effects/general-text-effectifier';

// TODO: add a lot more emojis (if I feel like it)
const replacements = [
 { wordRegExp: /zombie/g, emoji: '🧟' },
 { wordRegExp: /sparkle/g, emoji: '✨' },
 { wordRegExp: /joy/g, emoji: '😂' },
 { wordRegExp: /(sad|sadness|depressed|depression)/g, emoji: '😟' },
 { wordRegExp: /(angry|anger|mad|upset)/g, emoji: '😡' },
 { wordRegExp: /(apple)/g, emoji: '🍎' },
];

(function emojiSubstitutions() {
 generalTextEffectifier((text) => {
  let emojiText = text;
  replacements.forEach(({ wordRegExp, emoji }) => {
   emojiText = emojiText.replace(wordRegExp, emoji);
  });

  return [new Text(emojiText)];
 }, 'emoji substitutions');
})();
