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
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/category-page-view-sort.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/category-page-view-sort.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/category-page-view-sort.meta.js
// ==/UserScript==

import categoryPageSort from '../../lib/apis/category-page-sort';

(function categoryPageViewSort() {
 const categoryContentSelector = '#mw-pages div.mw-category';
 const buttonParentSelector = '#mw-pages > p';
 const metricName = 'view count';
 const categoryLinkSelector = '#mw-content-text #mw-pages .mw-category a[href^="/wiki"]';
 const getPageTitle = (link: HTMLAnchorElement) => link.href.match(/\/wiki\/(.*)$/)[1];
 const today = new Date();
 const startDate = new Date(Date.now() - 26 * 24 * 60 * 60 * 1000);
 const isoRegExp = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
 const formatDate = (date: Date) => {
  const { year, month, day } = date.toISOString().match(isoRegExp).groups;
  return `${year}${month}${day}`;
 };

 const formattedToday = formatDate(today);
 const formattedStartDate = formatDate(startDate);
 const fetchAddress = (link: HTMLAnchorElement) =>
  `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/user/${getPageTitle(
   link,
  )}/daily/${formattedStartDate}/${formattedToday}`;
 const linkAttribute = `page-${metricName.replace(/\s+/g, '-')}`;
 const fetchPromiseHandler = (link: HTMLAnchorElement, solve: (x: string) => void) => (r: Response) => {
  r.json().then((j) => {
   if (Array.isArray(j.items)) {
    const metric = j.items.reduce((acc: number, e: { views: number }) => acc + e.views, 0);
    const result = `page ${metricName} for ${getPageTitle(link)} is ${metric}`;
    console.log(result);
    link.appendChild(new Text(`(page ${metricName}: ${metric})`));
    link.setAttribute(linkAttribute, metric);
    solve(result);
   } else {
    console.log('no items', j);
    solve('');
   }
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
