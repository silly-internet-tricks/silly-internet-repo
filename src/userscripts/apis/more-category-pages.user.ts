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
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/more-category-pages.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/more-category-pages.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/more-category-pages.meta.js
// ==/UserScript==

(function moreCategoryPages() {
 const parser: DOMParser = new DOMParser();
 const buttonForMorePages: (
  pageDescriptor: string,
  pageLinkHref: string,
  pagePlacer: (nextPage: Element) => void,
  pageSelector: string,
 ) => void = function buttonForMorePages(pageDescriptor, pageLinkHref, pagePlacer, pageSelector) {
  const button: HTMLElement = document.createElement('button');
  document.querySelector('div#mw-pages').insertAdjacentElement('beforeend', button);
  button.appendChild(new Text(`get all ${pageDescriptor} pages`));

  button.addEventListener('click', () => {
   const getPage: (href: string) => void = function getPage(href) {
    return fetch(href)
     .then((r) => r.text())
     .then((t) => {
      const dom: Document = parser.parseFromString(t, 'text/html');
      const nextPage: Element = dom.querySelector('#mw-pages div.mw-content-ltr');
      pagePlacer(nextPage);
      const nextPageLinkFromDom: HTMLAnchorElement = dom.querySelector(pageSelector);
      if (nextPageLinkFromDom) {
       getPage(nextPageLinkFromDom.href);
      } else {
       const headingSet: Set<string> = new Set<string>();
       document.querySelectorAll('#mw-pages h3').forEach((heading: HTMLElement) => {
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

 const nextPageSelector: string = '#mw-pages a[href*=pagefrom]';
 const nextPageLink: HTMLAnchorElement = document.querySelector(nextPageSelector);
 if (nextPageLink) {
  buttonForMorePages(
   'following',
   nextPageLink.href,
   (page) => {
    const lastDiv: Element = [...document.querySelectorAll('#mw-pages div.mw-content-ltr')].pop();
    const hr: Element = document.createElement('hr');
    lastDiv.insertAdjacentElement('afterend', hr);
    hr.insertAdjacentElement('afterend', page);
   },
   nextPageSelector,
  );
 }

 const prevPageSelector: string = '#mw-pages a[href*=pageuntil]';
 const prevPageLink: HTMLAnchorElement = document.querySelector(prevPageSelector);
 if (prevPageLink) {
  buttonForMorePages(
   'preceding',
   prevPageLink.href,
   (page) => {
    const firstDiv: Element = document.querySelector('#mw-pages div.mw-content-ltr');
    const hr: Element = document.createElement('hr');
    firstDiv.insertAdjacentElement('beforebegin', hr);
    hr.insertAdjacentElement('beforebegin', page);
   },
   prevPageSelector,
  );
 }
})();
