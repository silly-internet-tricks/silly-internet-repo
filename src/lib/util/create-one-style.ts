import elementStylesToStyle from './element-styles-to-style';
import calculateSpecificity from './specificity';
import setEquality from './set-equality';
import { pseudoElementRegExp, pseudoClassRegExp } from './selector-regexps';

export default function createOneStyle() {
 document.body.appendChild(elementStylesToStyle());
 const stylesheets = [...document.styleSheets];

 const rules = stylesheets
  .flatMap((e) => {
   try {
    return [...e.cssRules];
   } catch {
    // if the stylesheet is not accessible (due to content security policy)
    // then for now I will simply not worry about it
    return [];
   }
  })
  .filter((e) => e);

 // TODO: check on whether non-style rules might have empty style
 const nonStyleRules = rules.filter((e) => !(e instanceof CSSStyleRule));
 const cssTexts: string[] = nonStyleRules.map((e) => e.cssText);

 const styleRules: CSSStyleRule[] = rules.filter((e) => e instanceof CSSStyleRule) as CSSStyleRule[];

 const nonEmptyCssRules = [...styleRules].filter((e) => e.style.cssText.length > 0);

 interface CssRuleData {
  selectorText: string;
  rules: CSSStyleRule[];
  selectedElements: Set<HTMLElement>;
 }

 const cssRules = new Map<string, CssRuleData>();
 const inAttrSelectorEndRegExp = /\[[^=]=['"][^'"]*$/;
 const inAttrSelectorStartRegExp = /^[^'"[]*['"][^[\]]*\]/; // a[href*='x,y'] // a[href*='x

 const addRule = (rule: CSSStyleRule) => (selector: string) => {
  if (selector.match(inAttrSelectorEndRegExp) || selector.match(inAttrSelectorStartRegExp)) {
   throw `handling comma in attribute selector is not implemented. Selector fragment was: ${selector}`;
  }

  const querySelector = selector
   .replace(pseudoElementRegExp, '')
   .replace(pseudoClassRegExp, '')
   .trim()
   // handle special cases as they come up
   .replace(/[>+~]$/, '');
  if (!querySelector) return;
  const selectedElements = new Set<HTMLElement>(document.querySelectorAll(querySelector));
  if (selectedElements.size > 0) {
   cssRules.set(selector, { selectorText: selector, rules: [rule], selectedElements });
  }
 };

 nonEmptyCssRules.forEach((rule) => {
  // when we look at the selector text I want to:
  // 1. check what elements the selector text matches on the page
  // 1 a. (note that selector text with pseudo-classes and/or pseudo-elements will need to have those stripped out)
  // 2. if the selector text does not match any element, skip it
  // 3. if the selector text matches the exact same set of elements as another selector text, then combine the rules.
  // 3 a. (use the selector text with least specificity)
  if (cssRules.has(rule.selectorText)) {
   cssRules.get(rule.selectorText).rules.push(rule);
  } else {
   rule.selectorText.split(',').forEach(addRule(rule));
  }
 });

 // we need only compare each cssruledata selected element set to others of its own size
 // so, if we sort the cssRuleData by set size we won't end up going over the whole array each time

 const cssRulesByElementsSelected = new Map<number, CssRuleData[]>();

 [...cssRules].forEach((rule) => {
  if (cssRulesByElementsSelected.has(rule[1].selectedElements.size)) {
   cssRulesByElementsSelected.get(rule[1].selectedElements.size).push(rule[1]);
  } else {
   cssRulesByElementsSelected.set(rule[1].selectedElements.size, [rule[1]]);
  }
 });

 const specificitySort = (selector: string) => {
  const specifityTuple = calculateSpecificity(selector);
  // Why multiply by 256? See here: https://stackoverflow.com/a/11934505
  return specifityTuple[0] * 256 * 256 + specifityTuple[1] * 256 + specifityTuple[2];
 };

 const combineRulesWithSameSelectedElements =
  (sortedEntries: CssRuleData[]) => (sortedEntry: CssRuleData, i: number) => {
   // this is where we combine rules if they have the same set of selected elements
   const { selectedElements } = sortedEntry;
   const setEquals = setEquality(selectedElements);
   for (let j = i + 1; j < sortedEntries.length; j++) {
    if (sortedEntries[j] && setEquals(sortedEntries[j].selectedElements)) {
     // this is where the magic happens
     // we merge sortedEntries[j] into sortedEntry.
     // (we'll delete sortedEntries[j]. the empty entry can be filtered out afterwards)
     sortedEntry.rules = sortedEntry.rules.concat(sortedEntries[j].rules);
     delete sortedEntries[j];
    }
   }
  };

 [...cssRulesByElementsSelected]
  .sort((a, b) => a[0] - b[0])
  .forEach((entry) => {
   const sortedEntries = entry[1].sort(
    (a, b) => specificitySort(a.selectorText) - specificitySort(b.selectorText),
   );

   sortedEntries.forEach(combineRulesWithSameSelectedElements(sortedEntries));
  });

 // once we have this map, I'll want to sort by specificity (least to greatest)
 // let's also consider selectors that are joined by commas (split them up and duplicate their rules ?)
 // a comma might appear in an attribute selector (probably not very often)
 // if that case comes up, I'll throw an error, then decide what to do at that point

 const dedupeRegExp = /([;{] [\w-]+: [^;]+)(.*?)(\1)/;
 // 1. combine all style rules that have the same selector text.
 const selectorsDeduped = [...cssRulesByElementsSelected]
  .flatMap((e) => e[1])
  .map((e) => `${e.selectorText} { ${e.rules.map((rule) => rule.style.cssText).join(' ')} }`);

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
 style.appendChild(new Text(`${deduped.join('\n\n')}\n\n${cssTexts.join('\n\n')}`));

 return style;
}
