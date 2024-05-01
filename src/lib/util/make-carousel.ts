import insertCSS from './insert-css';

// type MakeCarousel = (p: HTMLElement, c: ChildNode[]) => void;
export default function makeCarousel(parent: HTMLElement, children: Element[]) {
 if (!parent.id) throw new Error('parent id is required');
 if (children.find((child) => child.classList.length > 0)) {
  throw new Error('the children are required to be passed in with no classes (classes can be added after)');
 }

 const carouselContainer: Element = document.createElement('div');
 carouselContainer.id = `${parent.id}-carousel-container`;
 parent.appendChild(carouselContainer);

 children.forEach((child) => {
  child.classList.add('carousel-0');
  carouselContainer.appendChild(child);
 });

 const numberOfChildElements: number = children.length;
 const widthOfParentElement: number = parent.getBoundingClientRect().width;
 const marginSize: number = 10;
 const pxChildWidth: number = widthOfParentElement + marginSize;
 const calculatedContainerWidth: number = pxChildWidth * numberOfChildElements;

 // TODO: note that the parent should have overflow hidden
 // TODO: find the right calculation for the transform amount.
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
  const carouselNumber: number = Number(children[0].classList[0].match(/(\d+)$/)[1]);
  children.forEach((child) => {
   child.classList.replace(child.classList[0], `carousel-${(1 + carouselNumber) % children.length}`);
  });
 });
}
