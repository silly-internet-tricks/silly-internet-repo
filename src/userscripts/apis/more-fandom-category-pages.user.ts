// ==UserScript==
// @name         More Fandom Category Pages
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Get all the following category pages on a fandom wiki and show them on the page you're at
// @author       Josh Parker
// @match        https://*.fandom.com/wiki/Category:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/more-fandom-category-pages.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/more-fandom-category-pages.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/more-fandom-category-pages.meta.js
// ==/UserScript==

import insertCSS from '../../lib/util/insert-css';

(function moreCategoryPages() {
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

 const parser: DOMParser = new DOMParser();
 const buttonForMorePages: (
  pageDescriptor: string,
  pageLinkHref: string,
  pagePlacer: (nextPage: Element) => void,
  pageSelector: string,
 ) => void = function buttonForMorePages(pageDescriptor, pageLinkHref, pagePlacer, pageSelector) {
  const button: HTMLElement = document.createElement('button');
  document.querySelector('div#content').insertAdjacentElement('beforeend', button);
  button.appendChild(new Text(`get all ${pageDescriptor} pages`));

  button.addEventListener('click', () => {
   const getPage: (href: string) => void = function getPage(href) {
    return fetch(href)
     .then((r) => r.text())
     .then((t) => {
      const dom: Document = parser.parseFromString(t, 'text/html');
      const nextPage: Element = dom.querySelector('div.category-page__members');
      pagePlacer(nextPage);
      const nextPageLinkFromDom: HTMLAnchorElement = dom.querySelector(pageSelector);
      if (nextPageLinkFromDom) {
       getPage(nextPageLinkFromDom.href);
      } else {
       const headingSet: Set<string> = new Set<string>();
       document.querySelectorAll('div.category-page__first-char').forEach((heading: HTMLElement) => {
        if (headingSet.has(heading.textContent)) {
         heading.style.setProperty('display', 'none');
        } else {
         headingSet.add(heading.textContent);
        }
       });
      }
     });
   };

   getPage(pageLinkHref);
  });
 };

 const nextPageSelector: string = '.category-page__pagination-next';
 const nextPageLink: HTMLAnchorElement = document.querySelector(nextPageSelector);
 if (nextPageLink) {
  buttonForMorePages(
   'following',
   nextPageLink.href,
   (page) => {
    const lastDiv: Element = [...document.querySelectorAll('div.category-page__members')].pop();
    const hr: Element = document.createElement('hr');
    lastDiv.insertAdjacentElement('afterend', hr);
    hr.insertAdjacentElement('afterend', page);
   },
   nextPageSelector,
  );
 }

 const prevPageSelector: string = '.category-page__pagination-prev';
 const prevPageLink: HTMLAnchorElement = document.querySelector(prevPageSelector);
 if (prevPageLink) {
  buttonForMorePages(
   'preceding',
   prevPageLink.href,
   (page) => {
    const firstDiv: Element = document.querySelector('div.category-page__members');
    const hr: Element = document.createElement('hr');
    firstDiv.insertAdjacentElement('beforebegin', hr);
    hr.insertAdjacentElement('beforebegin', page);
   },
   prevPageSelector,
  );
 }
})();
