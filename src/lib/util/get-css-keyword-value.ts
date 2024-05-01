export default function getCssKeywordValue(htmlElement: HTMLElement, keyword: string) {
 const cssKeywordValue: CSSKeywordValue = htmlElement.computedStyleMap().get(keyword) as CSSKeywordValue;

 if (!cssKeywordValue.value) {
  throw new Error(`expected the css style value ${cssKeywordValue} to be a CSSKeywordValue with a value`);
 }

 return cssKeywordValue.value;
}
