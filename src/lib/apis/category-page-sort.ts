export default function categoryPageSort(
 buttonParentSelector: string,
 metricName: string,
 categoryLinkSelector: string,
 fetchAddress: (link: HTMLAnchorElement) => string,
 fetchPromiseHandler: (link: HTMLAnchorElement, solve: (x: string) => void) => (r: Response) => void,
 categoryContentSelector: string,
 linkAttribute: string,
) {
 const button = document.createElement('button');
 const buttonParent = document.querySelector(buttonParentSelector);
 button.appendChild(new Text(`show page ${metricName}s`));
 buttonParent.appendChild(button);

 button.addEventListener('click', () => {
  const categoryLinks = [...document.querySelectorAll(categoryLinkSelector)] as HTMLAnchorElement[];

  Promise.all(
   categoryLinks.map(
    (link, i) =>
     new Promise((solve, ject) => {
      setTimeout(
       () =>
        fetch(fetchAddress(link))
         .then(fetchPromiseHandler(link, solve))

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
   sortButton.appendChild(new Text(`sort by page ${metricName}s`));
   sortButton.addEventListener('click', () => {
    categoryLinks.forEach((link) => link.parentNode.removeChild(link));

    // TODO: also make the styling look better/closer to the original after sorting
    // TODO: we'll also want to be able to undo this change
    document.querySelectorAll(categoryContentSelector).forEach((e) => {
     e.innerHTML = '';
    });

    const sortedLinks = [...categoryLinks].sort(
     (a, b) => Number(b.getAttribute(linkAttribute)) - Number(a.getAttribute(linkAttribute)),
    );

    const firstMwCategory = document.querySelector(categoryContentSelector);
    const ul = document.createElement('ul');
    firstMwCategory.appendChild(ul);

    sortedLinks.forEach((link) => {
     const li = document.createElement('li');
     li.appendChild(link);
     ul.appendChild(li);
    });
   });

   buttonParent.appendChild(sortButton);
  });
 });
}
