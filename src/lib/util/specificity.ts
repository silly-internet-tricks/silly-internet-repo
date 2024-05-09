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
 const noElements = noClasses.replace(elementRegExp, '');

 // Log any remaining parts of the selector (if any) to check for omissions
 console.log('Remaining parts of the selector:', noElements);

 return [idCount, classCount + attributeCount, elementCount + pseudoElementCount];
}
