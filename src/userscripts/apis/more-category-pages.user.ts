// ==UserScript==
// @name         More Category Pages
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Get all the following category pages and show them on the page you're at
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/Category:*
// @match        https://en.wikipedia.org/w/index.php?title=Category:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/more-category-pages.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/more-category-pages.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/more-category-pages.meta.js
// ==/UserScript==

import moreCategoryPages from '../../lib/apis/more-category-pages';

(function moreWikipediaCategoryPages() {
 const contentSelector = 'div#mw-pages';
 const pageContentSelector = '#mw-pages div.mw-content-ltr';
 const headingSelector = '#mw-pages h3';
 const nextPageSelector: string = '#mw-pages a[href*=pagefrom]';
 const prevPageSelector: string = '#mw-pages a[href*=pageuntil]';

 moreCategoryPages(
  contentSelector,
  pageContentSelector,
  headingSelector,
  nextPageSelector,
  prevPageSelector,
 );
})();
