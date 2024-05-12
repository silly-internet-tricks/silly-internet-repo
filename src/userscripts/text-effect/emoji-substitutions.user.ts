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
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/f91e7b8aa2ff0d314f564615809d0780/raw/emoji-substitutions.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/f91e7b8aa2ff0d314f564615809d0780/raw/emoji-substitutions.meta.js
// ==/UserScript==

import generalTextEffectifier from '../../lib/effects/general-text-effectifier';

// TODO: add a lot more emojis (if I feel like it)
const replacements = [
 { wordRegExp: /zombie/gi, emoji: '🧟' },
 { wordRegExp: /sparkle/gi, emoji: '✨' },
 { wordRegExp: /joy/gi, emoji: '😂' },
 { wordRegExp: /(sad|sadness|depressed|depression)/gi, emoji: '😟' },
 { wordRegExp: /(angry|anger|mad|upset)/gi, emoji: '😡' },
 { wordRegExp: /(apple)/gi, emoji: '🍎' },
 { wordRegExp: /(banana|guineo|plantain|platano)/gi, emoji: '🍌' },
 { wordRegExp: /(avocado)/gi, emoji: '🥑' },
 { wordRegExp: /(clown)/gi, emoji: '🤡' },
 { wordRegExp: /(circus)/gi, emoji: '🎪' },
 { wordRegExp: /(fireworks)/gi, emoji: '🎆' },
 { wordRegExp: /(telephone)/gi, emoji: '☎️' },
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
