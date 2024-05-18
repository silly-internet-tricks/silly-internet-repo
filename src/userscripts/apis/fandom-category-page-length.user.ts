// ==UserScript==
// @name         Fandom Category Page Length
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Show the page length on each page in a fandom wiki category and add the option to sort by page views
// @author       Josh Parker
// @match        https://*.fandom.com/wiki/Category:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/category-page-view-sort.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/category-page-view-sort.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/74b45baefede276f61fb0a84dd621772/raw/category-page-view-sort.meta.js
// ==/UserScript==

(function fandomCategoryPageLength() {
 const parser = new DOMParser();

 const linkAttribute = 'page-length';

 const button = document.createElement('button');
 const p = document.querySelector('#mw-content-text p.category-page__total-number');
 button.appendChild(new Text('show page lengths'));
 p.appendChild(button);

 button.addEventListener('click', () => {
  const categoryLinks = [
   ...document.querySelectorAll('.category-page__members a[href^="/wiki"].category-page__member-link'),
  ] as HTMLAnchorElement[];

  Promise.all(
   categoryLinks.map(
    (link, i) =>
     new Promise((solve, ject) => {
      setTimeout(
       () =>
        fetch(`${link}?action=info`)
         .then((r) => r.text())
         .then((t) => {
          const dom = parser.parseFromString(t, 'text/html');
          const pageLength = Number(
           dom.querySelector('#mw-pageinfo-length td + td').textContent.replace(/\D/g, ''),
          );

          const result = `page length for ${link.title} is ${pageLength}`;
          console.log(result);
          link.appendChild(new Text(` (page length: ${pageLength})`));
          link.setAttribute(linkAttribute, `${pageLength}`);
          solve(result);
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
   sortButton.appendChild(new Text('sort by page lengths'));
   sortButton.addEventListener('click', () => {
    categoryLinks.forEach((link) => link.parentNode.removeChild(link));

    // TODO: also make the styling look better/closer to the original after sorting
    // TODO: we'll also want to be able to undo this change
    document.querySelectorAll('.category-page__members-wrapper').forEach((e) => {
     e.innerHTML = '';
    });

    const sortedLinks = [...categoryLinks].sort(
     (a, b) => Number(b.getAttribute(linkAttribute)) - Number(a.getAttribute(linkAttribute)),
    );

    const firstMwCategory = document.querySelector('.category-page__members-wrapper');
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
