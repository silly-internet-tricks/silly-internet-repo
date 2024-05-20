// ==UserScript==
// @name         Fandom Category Page Length
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Show the page length on each page in a fandom wiki category and add the option to sort by page views
// @author       Josh Parker
// @match        https://*.fandom.com/wiki/Category:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/fandom-category-page-length.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/23eeade733231491b0f5d2a74f3c1051/raw/fandom-category-page-length.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/23eeade733231491b0f5d2a74f3c1051/raw/fandom-category-page-length.meta.js
// ==/UserScript==

import categoryPageSort from '../../lib/apis/category-page-sort';

(function fandomCategoryPageLength() {
 const categoryContentSelector = '.category-page__members-wrapper';
 const buttonParentSelector = '#mw-content-text p.category-page__total-number';
 const metricName = 'length';
 const categoryLinkSelector = '.category-page__members a[href^="/wiki"].category-page__member-link';
 const parser = new DOMParser();
 const fetchAddress = (link: HTMLAnchorElement) => `${link}?action=info`;

 const linkAttribute = `page-${metricName.replace(/\s+/g, '-')}`;
 const fetchPromiseHandler = (link: HTMLAnchorElement, solve: (x: string) => void) => (r: Response) => {
  r.text().then((t) => {
   const dom = parser.parseFromString(t, 'text/html');
   const metric = Number(dom.querySelector('#mw-pageinfo-length td + td').textContent.replace(/\D/g, ''));

   const result = `page ${metricName} for ${link.title} is ${metric}`;
   console.log(result);
   link.appendChild(new Text(` (page ${metricName}: ${metric})`));
   link.setAttribute(linkAttribute, `${metric}`);
   solve(result);
  });
 };

 categoryPageSort(
  buttonParentSelector,
  metricName,
  categoryLinkSelector,
  fetchAddress,
  fetchPromiseHandler,
  categoryContentSelector,
  linkAttribute,
 );
})();
