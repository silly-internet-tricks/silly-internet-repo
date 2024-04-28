import generalElementEffectifier from './general-element-effectifier';
import elementEffectHandler from './element-effect-handler';

export default function generalTextEffectifier(
 affectText: (t: string) => Node[],
 scriptName?: string,
 targetClassName?: string,
) {
 const textNodeHandler: (target: Text, targetChildNodes: Node[], prevNodeWasText: boolean) => Node[] = (
  textNode: Text,
  newChildNodes: ChildNode[],
  prevNodeWasText: boolean,
 ) => {
  console.log(textNode);
  console.log(newChildNodes);
  console.log(prevNodeWasText);
  console.log(textNode.textContent);
  if (prevNodeWasText) {
   newChildNodes.push(new Text(' '));
  }

  const affectedNodes: Node[] = affectText(textNode.textContent);
  console.log(affectedNodes);
  return affectedNodes;
 };

 type ChildNodeEffectifier = (target: EventTarget, childNodes: ChildNode[]) => Node[];

 const childNodeEffectifier: ChildNodeEffectifier = function childNodeEffectifier(target, childNodes) {
  return elementEffectHandler(childNodes, textNodeHandler, (e) => e);
 };

 generalElementEffectifier(
  childNodeEffectifier,
  scriptName,
  targetClassName,
  /* , (target) => target */
 );
}
