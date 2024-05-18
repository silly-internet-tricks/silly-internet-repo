export default function moreCategoryPages(
 contentSelector: string,
 pageContentSelector: string,
 headingSelector: string,
 nextPageSelector: string,
 prevPageSelector: string,
) {
 const parser: DOMParser = new DOMParser();
 const buttonForMorePages: (
  pageDescriptor: string,
  pageLinkHref: string,
  pagePlacer: (nextPage: Element) => void,
  pageSelector: string,
 ) => void = function buttonForMorePages(pageDescriptor, pageLinkHref, pagePlacer, pageSelector) {
  const button: HTMLElement = document.createElement('button');
  document.querySelector(contentSelector).insertAdjacentElement('beforeend', button);
  button.appendChild(new Text(`get all ${pageDescriptor} pages`));

  button.addEventListener('click', () => {
   const getPage: (href: string) => void = function getPage(href) {
    return fetch(href)
     .then((r) => r.text())
     .then((t) => {
      const dom: Document = parser.parseFromString(t, 'text/html');
      const nextPage: Element = dom.querySelector(pageContentSelector);
      pagePlacer(nextPage);
      const nextPageLinkFromDom: HTMLAnchorElement = dom.querySelector(pageSelector);
      if (nextPageLinkFromDom) {
       getPage(nextPageLinkFromDom.href);
      } else {
       const headingSet: Set<string> = new Set<string>();
       document.querySelectorAll(headingSelector).forEach((heading: HTMLElement) => {
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

 const nextPageLink: HTMLAnchorElement = document.querySelector(nextPageSelector);
 if (nextPageLink) {
  buttonForMorePages(
   'following',
   nextPageLink.href,
   (page) => {
    const lastDiv: Element = [...document.querySelectorAll(pageContentSelector)].pop();
    const hr: Element = document.createElement('hr');
    lastDiv.insertAdjacentElement('afterend', hr);
    hr.insertAdjacentElement('afterend', page);
   },
   nextPageSelector,
  );
 }

 const prevPageLink: HTMLAnchorElement = document.querySelector(prevPageSelector);
 if (prevPageLink) {
  buttonForMorePages(
   'preceding',
   prevPageLink.href,
   (page) => {
    const firstDiv: Element = document.querySelector(pageContentSelector);
    const hr: Element = document.createElement('hr');
    firstDiv.insertAdjacentElement('beforebegin', hr);
    hr.insertAdjacentElement('beforebegin', page);
   },
   prevPageSelector,
  );
 }
}
