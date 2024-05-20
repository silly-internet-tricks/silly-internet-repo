// ==UserScript==
// @name         More Fandom Category Pages
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Get all the following category pages on a fandom wiki and show them on the page you're at
// @author       Josh Parker
// @match        https://*.fandom.com/wiki/Category:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/more-fandom-category-pages.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/08550bbd9cd0e32bd3ee5565abff8190/raw/more-fandom-category-pages.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/08550bbd9cd0e32bd3ee5565abff8190/raw/more-fandom-category-pages.meta.js
// ==/UserScript==

import insertCSS from '../../lib/util/insert-css';
import moreCategoryPages from '../../lib/apis/more-category-pages';

(function moreFandomCategoryPages() {
 insertCSS(`#content > button {
  background: none;
  padding: 0.5em 1.5em;
  border: solid 1px;
  border-radius: 0.3em;
  font-weight: bold;
  text-transform: uppercase;
  font-size: smaller;
  margin-left: 20dvw;
}`);

 const contentSelector = 'div#content';
 const pageContentSelector = 'div.category-page__members';
 const headingSelector = 'div.category-page__first-char';
 const nextPageSelector: string = '.category-page__pagination-next';
 const prevPageSelector: string = '.category-page__pagination-prev';

 moreCategoryPages(
  contentSelector,
  pageContentSelector,
  headingSelector,
  nextPageSelector,
  prevPageSelector,
 );
})();
