export default function createOneStyle() {
 const stylesheets = [...document.styleSheets];

 const rules = stylesheets
  .flatMap((e) => {
   try {
    return [...e.cssRules];
   } catch {
    return [];
   }
  })
  .filter((e) => e);

 const nonStyleRules = rules.filter((e) => !(e instanceof CSSStyleRule));
 const cssTexts: string[] = nonStyleRules.map((e) => e.cssText);

 // TODO: 2. combine all style rules which have different selector texts,
 //    yet select the exact same set of elements in the page (using the least specific selector)

 const styleRules: CSSStyleRule[] = rules.filter((e) => e instanceof CSSStyleRule) as CSSStyleRule[];
 const cssRules = new Map<string, CSSStyleRule[]>();
 styleRules.forEach((rule) => {
  if (cssRules.has(rule.selectorText)) {
   cssRules.get(rule.selectorText).push(rule);
  } else {
   cssRules.set(rule.selectorText, [rule]);
  }
 });

 const nonDuplicatedCssRules = [...cssRules].filter((e) => e[1].length <= 1);
 const duplicatedCssRules = [...cssRules].filter((e) => e[1].length > 1);
 const dedupeRegExp = /([;{] [\w-]+: [^;]+)(.*?)(\1)/;
 // 1. combine all style rules that have the same selector text.
 const selectorsDeduped = duplicatedCssRules.map(
  (x) => `${x[0]} { ${x[1].map((e) => e.style.cssText).join(' ')} }`,
 );

 // 3. dedupe all property values on a style rule that have the exact same values.
 // 4. if there are two instances of the same style property with different values,
 //    keep both, so I can decide which I want manually later
 const deduped = selectorsDeduped.map((z) => {
  let cssText = z;
  while (cssText.match(dedupeRegExp)) {
   cssText = cssText.replace(dedupeRegExp, '$1$2');
  }

  return cssText;
 });

 const style = document.createElement('style');
 style.appendChild(
  new Text(
   `${deduped.join('\n\n')}\n\n${nonDuplicatedCssRules
    .map((rule) => rule[1][0].cssText)
    .join('\n\n')}\n\n${cssTexts.join('\n\n')}`,
  ),
 );

 return style;
}
