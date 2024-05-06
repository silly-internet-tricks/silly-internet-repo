export default function calculateSpecificity(selector: string) {
 // Remove :is(), :not(), and :has() pseudo-classes and retain their parameters
 const cleanedSelector = selector.replace(/:(is|not|has)\(([^)]*)\)/g, ' $2 ');

 const attributeRegExp = /\[[^\]]*\]/g;
 const attributeCount = cleanedSelector.match(attributeRegExp)?.length || 0;
 const noAttributes = cleanedSelector.replace(attributeRegExp, '');

 const pseudoElementRegExp = /::[^.:#>~+\s]+/g;
 const pseudoElementCount = noAttributes.match(pseudoElementRegExp)?.length || 0;
 const noPseudoElements = noAttributes.replace(pseudoElementRegExp, '');

 const idRegExp = /#[^.:#>~+\s]+/g;
 const idCount = noPseudoElements.match(idRegExp)?.length || 0;
 const noIds = noPseudoElements.replace(idRegExp, '');

 const classRegExp = /[.:][^.:#>~+\s]+/g;
 const classCount = noIds.match(classRegExp)?.length || 0;
 const noClasses = noIds.replace(classRegExp, '');

 const elementRegExp = /[^.:#>~+\s]+/g;
 const elementCount = noClasses.match(elementRegExp)?.length || 0;
 const noElements = noClasses.replace(elementRegExp, '');

 // Log any remaining parts of the selector (if any) to check for omissions
 console.log('Remaining parts of the selector:', noElements);

 return [idCount, classCount + attributeCount, elementCount + pseudoElementCount];
}
