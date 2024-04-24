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
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/more-category-pages.user.js
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/more-category-pages.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/more-category-pages.meta.js
// ==/UserScript==

(function moreCategoryPages() {
 const parser = new DOMParser();
 const buttonForMorePages = function buttonForMorePages(
  pageDescriptor,
  pageLinkHref,
  pagePlacer,
  pageSelector,
 ) {
  const button = document.createElement('button');
  document.querySelector('div#mw-pages').insertAdjacentElement('beforeend', button);
  button.appendChild(new Text(`get all ${pageDescriptor} pages`));

  button.addEventListener('click', () => {
   const getPage = (href) => fetch(href)
    .then((r) => r.text()).then((t) => {
     const dom = parser.parseFromString(t, 'text/html');
     const nextPage = dom.querySelector('#mw-pages div.mw-content-ltr');
     pagePlacer(nextPage);
     const nextPageLinkFromDom = dom.querySelector(pageSelector);
     if (nextPageLinkFromDom) {
      getPage(nextPageLinkFromDom.href);
     } else {
      const headingSet = new Set();
      document.querySelectorAll('#mw-pages h3').forEach((heading) => {
       if (headingSet.has(heading.textContent)) {
        heading.style.setProperty('display', 'none');
       } else {
        headingSet.add(heading.textContent);
       }
      });
     }
    });

   getPage(pageLinkHref);
  });
 };

 const nextPageSelector = '#mw-pages a[href*=pagefrom]';
 const nextPageLink = document.querySelector(nextPageSelector);
 if (nextPageLink) {
  buttonForMorePages('following', nextPageLink.href, (page) => {
   const lastDiv = [...document.querySelectorAll('#mw-pages div.mw-content-ltr')].pop();
   const hr = document.createElement('hr');
   lastDiv.insertAdjacentElement('afterend', hr);
   hr.insertAdjacentElement('afterend', page);
  }, nextPageSelector);
 }

 const prevPageSelector = '#mw-pages a[href*=pageuntil]';
 const prevPageLink = document.querySelector(prevPageSelector);
 if (prevPageLink) {
  buttonForMorePages('preceding', prevPageLink.href, (page) => {
   const firstDiv = document.querySelector('#mw-pages div.mw-content-ltr');
   const hr = document.createElement('hr');
   firstDiv.insertAdjacentElement('beforebegin', hr);
   hr.insertAdjacentElement('beforebegin', page);
  }, prevPageSelector);
 }
}());
