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
 const button = document.createElement('button');
 const p = document.querySelector('#mw-pages > p');
 button.appendChild(new Text('show page view counts'));
 p.appendChild(button);

 button.addEventListener('click', () => {
  const categoryLinks = [
   ...document.querySelectorAll('#mw-content-text #mw-pages .mw-category a[href^="/wiki"]'),
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

  Promise.all(
   categoryLinks
    .map((e) => e.href.match(/\/wiki\/(.*)$/)[1])
    .map(
     (pageTitle, i) =>
      new Promise((solve, ject) => {
       setTimeout(
        () =>
         fetch(
          `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/user/${pageTitle}/daily/${formattedStartDate}/${formattedToday}`,
         )
          .then((r) => r.json())
          .then((j) => {
           if (Array.isArray(j.items)) {
            const pageViewCount = j.items.reduce((acc: number, e: { views: number }) => acc + e.views, 0);
            const result = `page view count for ${pageTitle} is ${pageViewCount}`;
            console.log(result);

            const link = document.querySelector(`#mw-pages .mw-category a[href$="${pageTitle}"]`);
            link.appendChild(new Text(`(page view count: ${pageViewCount})`));
            link.setAttribute('page-view-count', pageViewCount);
            solve(result);
           } else {
            console.log('no items', j);
            solve('');
           }
          })
          .catch((reason) => {
           console.log('Hey! Listen!');
           console.log(reason);
           ject(reason);
          }),
        10 * i,
       );
      }),
    ),
  ).then(() => {
   const sortButton = document.createElement('button');
   sortButton.id = 'sit-sort-button';
   sortButton.appendChild(new Text('sort by page view counts'));
   sortButton.addEventListener('click', () => {
    categoryLinks.forEach((link) => link.parentNode.removeChild(link));

    // TODO: we'll also want to be able to undo this change
    document.querySelectorAll('#mw-pages div.mw-category').forEach((e) => {
     e.innerHTML = '';
    });

    const sortedLinks = [...categoryLinks].sort(
     (a, b) => Number(b.getAttribute('page-view-count')) - Number(a.getAttribute('page-view-count')),
    );

    const firstMwCategory = document.querySelector('#mw-pages div.mw-category');
    const ul = document.createElement('ul');
    firstMwCategory.appendChild(ul);

    sortedLinks.forEach((link) => {
     const li = document.createElement('li');
     li.appendChild(link);
     ul.appendChild(li);
    });
   });

   p.appendChild(sortButton);
  });
 });
})();
