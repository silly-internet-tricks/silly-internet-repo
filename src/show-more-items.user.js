// ==UserScript==
// @name         Show more items
// @namespace    http://tampermonkey.net/
// @version      2024-04-21
// @description  Show more items so I can click them faster!
// @author       Josh Parker
// @match        https://neal.fun/infinite-craft/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neal.fun
// @grant        none
// ==/UserScript==

(function showMoreItems() {
 const css = `
#__layout canvas ~ .sidebar {
  width: 100%;
}

.sidebar .item {
  margin: 0;
}
`;

 const style = document.createElement('style');
 style.appendChild(new Text(css));
 document.body.appendChild(style);
}());
