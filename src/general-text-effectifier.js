import generalElementEffectifier from './general-element-effectifier';
import elementEffectHandler from './element-effect-handler';

export default function generalTextEffectifier(affectText, scriptName, targetClassName) {
 const textNodeHandler = (textNode, newChildNodes, prevNodeWasText) => {
  if (prevNodeWasText) newChildNodes.push(new Text(' '));
  return affectText(textNode.textContent);
 };

 const childNodeEffectifier = function childNodeEffectifier(childNodes) {
  return elementEffectHandler(childNodes, textNodeHandler, (e) => e);
 };

 generalElementEffectifier(childNodeEffectifier, scriptName, targetClassName, (target) => target);
}
