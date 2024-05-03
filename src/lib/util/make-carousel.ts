import insertCSS from './insert-css';

export default function makeCarousel(parent: HTMLElement, children: Element[]) {
 if (!parent.id) throw new Error('parent id is required');
 if (children.find((child) => child.classList.length > 0)) {
  throw new Error('the children are required to be passed in with no classes (classes can be added after)');
 }

 const carouselContainer: Element = document.createElement('div');
 carouselContainer.id = `${parent.id}-carousel-container`;
 parent.appendChild(carouselContainer);
 let carouselNumber: number = 0;

 children.forEach((child) => {
  child.classList.add(`carousel-${carouselNumber}`);
  carouselContainer.appendChild(child);
 });

 const numberOfChildElements: number = children.length;
 const widthOfParentElement: number = parent.getBoundingClientRect().width;
 const marginSize: number = 10;
 const pxChildWidth: number = widthOfParentElement + marginSize;
 const calculatedContainerWidth: number = pxChildWidth * numberOfChildElements;

 // TODO: note that the parent should have overflow hidden
 insertCSS(`${children
  .map(
   (_, i) => `
  #${carouselContainer.id} > *.carousel-${i} {
       transform: translateX(-${pxChildWidth * i}px);
  }
         `,
  )
  .join('\n\n')}

#${carouselContainer.id} > * {
     transition: transform 0.5s;
     margin: 0;
     margin-right: ${marginSize}px;
     float: left;
     width: ${widthOfParentElement}px;
}

#${carouselContainer.id} {
 min-width: ${calculatedContainerWidth}px;
}
         `);

 parent.addEventListener('click', () => {
  carouselNumber += 1;
  children.forEach((child) => {
   child.classList.replace(child.classList[0], `carousel-${carouselNumber % children.length}`);
  });
 });
}
