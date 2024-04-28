import generalElementEffectifier from './general-element-effectifier';
import elementEffectHandler from './element-effect-handler';

export default function generalTextEffectifier(
 affectText: (t: string) => Node[],
 scriptName?: string,
 targetClassName?: string,
) {
 const textNodeHandler:
  (
   target: Text,
   targetChildNodes: Node[],
   prevNodeWasText: boolean
  ) => Node[] = (
   textNode: Text,
   newChildNodes: ChildNode[],
   prevNodeWasText: boolean,
  ) => {
   if (prevNodeWasText) newChildNodes.push(new Text(' '));
   return affectText(textNode.textContent);
  };

 const childNodeEffectifier:
  (
    target: EventTarget,
    childNodes: ChildNode[]
  ) => Node[] = function childNodeEffectifier(target, childNodes) {
   return elementEffectHandler(childNodes, textNodeHandler, (e) => e);
  };

 generalElementEffectifier(
  childNodeEffectifier,
  scriptName,
  targetClassName,
  /* , (target) => target */
 );
}
