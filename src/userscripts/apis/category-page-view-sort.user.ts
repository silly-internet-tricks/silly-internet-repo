// ==UserScript==
// @name         Category Page View Sort
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Show the page views on each page in a wikipedia category and add the option to sort by page views
// @author       Josh Parker
// @match        https://en.wikipedia.org/wiki/Category:*
// @match        https://en.wikipedia.org/w/index.php?title=Category:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/category-page-view-sort.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/category-page-view-sort.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/category-page-view-sort.meta.js
// ==/UserScript==

(function categoryPageViewSort() {
 const btn = document.createElement('button');
 const p = document.querySelector('#mw-pages > p');
 btn.appendChild(new Text('show page view counts'));
 p.appendChild(btn);

 btn.addEventListener('click', () => {
  const categoryLinks = [
   ...document.querySelectorAll('#mw-content-text .mw-category a[href^="/wiki"]'),
  ] as HTMLAnchorElement[];

  const today = new Date();
  const startDate = new Date(Date.now() - 26 * 24 * 60 * 60 * 1000);
  const isoRegExp = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
  const formatDate = (date: Date) => {
   const { year, month, day } = date.toISOString().match(isoRegExp).groups;
   return `${year}${month}${day}`;
  };

  const formattedToday = formatDate(today);
  const formattedStartDate = formatDate(startDate);

  categoryLinks
   .map((e) => e.href.match(/\/wiki\/(.*)$/)[1])
   .forEach((pageTitle, i) =>
    setTimeout(
     () =>
      fetch(
       `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/user/${pageTitle}/daily/${formattedStartDate}/${formattedToday}`,
      )
       .then((r) => r.json())
       .then((j) => {
        const pageViewCount = j.items.reduce((acc: number, e: { views: number }) => acc + e.views, 0);
        console.log(`page view count for ${pageTitle} is ${pageViewCount}`);

        // next step: show the viewcount on each link
        const link = document.querySelector(`#mw-pages .mw-category a[href$="${pageTitle}"]`);
        link.appendChild(new Text(`(page view count: ${pageViewCount})`));
       }),
     10 * i,
    ),
   );
 });
})();
