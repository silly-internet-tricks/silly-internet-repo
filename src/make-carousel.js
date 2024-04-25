import insertCSS from './insert-css';

export default function makeCarousel(parent, children) {
 children.forEach((child) => {
  child.classList.add('carousel-0');
  parent.appendChild(child);
 });

 // TODO: note the fact that the parent is required to have an id.
 // TODO: also note the fact that the children are required to be passed in with no classes.
 // TODO: find the right calculation for the transform amount.
 insertCSS(`${children.map((_, i) => `
  #${parent.id} > *.carousel-${i} {
       transform: translateX(-${180 * i}px);
  }
         `).join('\n\n')}

#${parent.id} > * {
     transition: transform 0.5s;
}
         `);

 parent.addEventListener('click', () => {
  console.log(parent.id);
  const carouselNumber = Number(children[0].classList[0].match(/(\d+)$/)[1]);
  children.forEach((child) => {
   child.classList.replace(child.classList[0], `carousel-${(1 + carouselNumber) % children.length}`);
  });
 });
}
