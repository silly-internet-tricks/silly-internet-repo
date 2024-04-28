// ==UserScript==
// @name         Show more items
// @namespace    http://tampermonkey.net/
// @version      2024-04-21
// @description  Show more items so I can click them faster!
// @author       Josh Parker
// @match        https://neal.fun/infinite-craft/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neal.fun
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/show-more-items.user.js
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/55ceac302028890f2fecd2a1f401b616/raw/show-more-items.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/55ceac302028890f2fecd2a1f401b616/raw/show-more-items.meta.js
// ==/UserScript==

(function showMoreItems() {
 const css: string = `
#__layout canvas ~ .sidebar {
  width: 100%;
}

.sidebar .item {
  margin: 0;
}
`;

 const style: Element = document.createElement('style');
 style.appendChild(new Text(css));
 document.body.appendChild(style);
}());
