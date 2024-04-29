import makeCarousel from '../make-carousel';
import getExampleDOM from '../get-example-dom';
// query utilities:
// adds special assertions like toHaveTextContent
import '@testing-library/jest-dom';

test('throw error if parent container does not have an id', async () => {
 const container: HTMLElement = getExampleDOM();
 expect(() => {
  makeCarousel(container, ['child one', 'child two', 'child three'].map((childText) => {
   const div: HTMLElement = document.createElement('div');
   div.appendChild(new Text(childText));
   return div;
  }));
 }).toThrow(/id is required/);
});

test('make a carousel', async () => {
 const container: HTMLElement = getExampleDOM();

 container.id = 'container';

 makeCarousel(container, ['child one', 'child two', 'child three'].map((childText) => {
  const div: HTMLElement = document.createElement('div');
  div.appendChild(new Text(childText));
  return div;
 }));

 const carousel: HTMLElement = container.querySelector('[id$="carousel-container"]') as HTMLElement;

 expect(carousel).toBeDefined();
});
