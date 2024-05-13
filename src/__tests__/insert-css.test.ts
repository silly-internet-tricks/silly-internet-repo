import insertCSS from '../lib/util/insert-css';
import getExampleDOM from '../lib/test/get-example-dom';
// query utilities:
// adds special assertions like toHaveTextContent
import '@testing-library/jest-dom';

test('insert some css', async () => {
 const container: HTMLElement = getExampleDOM();
 insertCSS(`
input {
 color: chartreuse;
 width: 100px;
}
 `);

 const input: HTMLInputElement = container.querySelector('input') as HTMLInputElement;
 expect(input).toBeDefined();

 const inputStyling: HTMLStyleElement = container.querySelector('style') as HTMLStyleElement;
 expect(inputStyling).toBeDefined();

 /* get bounding client rect does not work as expected in jsdom
 expect(input.getBoundingClientRect().width).toBe(100);
 */

 /* computed style map is not available in jsdom
 const styleMap: StylePropertyMapReadOnly = input.computedStyleMap();
 expect(styleMap).toBeDefined();
 const keywordValue: string = getCssKeywordValue(input, 'width');
 expect(keywordValue).toBe(100);
 */
});
