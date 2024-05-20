// ==UserScript==
// @name         tvtropes visitor count
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Show the visitor count on each page in a tvtropes page and add the option to sort by visitor count
// @author       Josh Parker
// @match        https://tvtropes.org/pmwiki/pmwiki.php/Main/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/tvtropes-visitor-count.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/dd85b9320e592c96410458bacb7114d1/raw/tvtropes-visitor-count.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/dd85b9320e592c96410458bacb7114d1/raw/tvtropes-visitor-count.meta.js
// ==/UserScript==

(function tvtropesVisitorCount() {
  // TODO: find out if we're getting rate limited or something
  // TODO: find out the cause of the 403 error
  const parser = new DOMParser();

 const getPageTitle = (link: HTMLAnchorElement) => link.href.match(/pmwiki\.php\/(.*)$/)[1];

 const linkAttribute = 'page-visitors';

 const button = document.createElement('button');
 const subpageLinks = document.querySelector('.subpage-links');
 button.appendChild(new Text('show visitor counts'));
 const li = document.createElement('li');
 li.appendChild(button);
 subpageLinks.appendChild(li);

 button.addEventListener('click', () => {
  const categoryLinks = [...document.querySelectorAll('.twikilink')] as HTMLAnchorElement[];

  Promise.all(
   categoryLinks.map(
    (link, i) =>
     new Promise((solve, ject) => {
      setTimeout(
       () =>
        fetch(
         `https://tvtropes.org/pmwiki/relatedsearch.php?term=${getPageTitle(link)}`,
        )
         .then((r) => r.text())
         .then((t) => {
          const dom = parser.parseFromString(t, 'text/html');
          const visitorCount = Number(
           dom.querySelector('#main-article p + p strong').textContent.replace(/\D/g, ''),
          );

          const result = `visitor count for ${getPageTitle(link)} is ${visitorCount}`;
          console.log(result);
          link.appendChild(new Text(` (visitor count: ${visitorCount})`));
          link.setAttribute(linkAttribute, `${visitorCount}`);
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
   sortButton.appendChild(new Text('sort by visitor counts'));
   sortButton.addEventListener('click', () => {
    categoryLinks.forEach((link) => link.parentNode.removeChild(link));

    // TODO: we'll also want to be able to undo this change
    document.querySelectorAll('#main-entry').forEach((e) => {
     e.innerHTML = '';
    });

    const sortedLinks = [...categoryLinks].sort(
     (a, b) => Number(b.getAttribute(linkAttribute)) - Number(a.getAttribute(linkAttribute)),
    );

    const firstMwCategory = document.querySelector('#main-entry');
    const ul = document.createElement('ul');
    firstMwCategory.appendChild(ul);

    sortedLinks.forEach((link) => {
     const sortedLi = document.createElement('li');
     sortedLi.appendChild(link);
     ul.appendChild(sortedLi);
    });
   });

   subpageLinks.appendChild(sortButton);
  });
 });
})();
