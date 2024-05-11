const nonSpecificPseudoClassRegExp = /:(is|not|has)\(([^)]*)\)/g;
const attributeRegExp = /\[[^\]]*\]/g;
const pseudoElementRegExp = /::[^.:#>~+\s]+/g;
const idRegExp = /#[^.:#>~+\s]+/g;
const classAndPseudoClassRegExp = /[.:][^.:#>~+\s]+/g;
const pseudoClassRegExp = /([:]([^.:#>~+\s()]+\([^()]+\)|[^.:#>~+\s]+))+/g;
const elementRegExp = /[^.:#>~+\s]+/g;

export {
 nonSpecificPseudoClassRegExp,
 attributeRegExp,
 pseudoElementRegExp,
 idRegExp,
 classAndPseudoClassRegExp,
 pseudoClassRegExp,
 elementRegExp,
};
