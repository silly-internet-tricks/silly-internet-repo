import insertCSS from './insert-css';

export default function makeCarousel(parent, children) {
 if (!parent.id) throw new Error('parent id is required');
 if (children.find((child) => child.classList.length > 0)) throw new Error('the children are required to be passed in with no classes (classes can be added after)');

 const carouselContainer = document.createElement('div');
 carouselContainer.id = `${parent.id}-carousel-container`;
 parent.appendChild(carouselContainer);

 children.forEach((child) => {
  child.classList.add('carousel-0');
  carouselContainer.appendChild(child);
 });

 const numberOfChildElements = children.length;
 const widthOfParentElement = parent.getBoundingClientRect().width;
 const marginSize = 10;
 const pxChildWidth = widthOfParentElement + marginSize;
 const calculatedContainerWidth = pxChildWidth * numberOfChildElements;

 // TODO: note that the parent should have overflow hidden
 // TODO: find the right calculation for the transform amount.
 insertCSS(`${children.map((_, i) => `
  #${carouselContainer.id} > *.carousel-${i} {
       transform: translateX(-${pxChildWidth * i}px);
  }
         `).join('\n\n')}

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
  const carouselNumber = Number(children[0].classList[0].match(/(\d+)$/)[1]);
  children.forEach((child) => {
   child.classList.replace(child.classList[0], `carousel-${(1 + carouselNumber) % children.length}`);
  });
 });
}
