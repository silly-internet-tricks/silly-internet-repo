import {
 nonSpecificPseudoClassRegExp,
 attributeRegExp,
 pseudoElementRegExp,
 idRegExp,
 classAndPseudoClassRegExp,
 elementRegExp,
} from './selector-regexps';

export default function calculateSpecificity(selector: string) {
 // Remove :is(), :not(), and :has() pseudo-classes and retain their parameters
 // because they do not count towards specificity. See: https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity#the_is_not_has_and_css_nesting_exceptions
 const cleanedSelector = selector.replace(nonSpecificPseudoClassRegExp, ' $2 ');

 const attributeCount = cleanedSelector.match(attributeRegExp)?.length || 0;
 const noAttributes = cleanedSelector.replace(attributeRegExp, '');

 const pseudoElementCount = noAttributes.match(pseudoElementRegExp)?.length || 0;
 const noPseudoElements = noAttributes.replace(pseudoElementRegExp, '');

 const idCount = noPseudoElements.match(idRegExp)?.length || 0;
 const noIds = noPseudoElements.replace(idRegExp, '');

 const classCount = noIds.match(classAndPseudoClassRegExp)?.length || 0;
 const noClasses = noIds.replace(classAndPseudoClassRegExp, '');

 const elementCount = noClasses.match(elementRegExp)?.length || 0;

 return [idCount, classCount + attributeCount, elementCount + pseudoElementCount];
}
