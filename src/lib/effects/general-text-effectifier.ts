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
  if (prevNodeWasText) {
   newChildNodes.push(new Text(' '));
  }

  const affectedNodes: Node[] = affectText(textNode.textContent);
  return affectedNodes;
 };

 type ChildNodeEffectifier = (target: Node, childNodes: ChildNode[]) => Node[];

 const childNodeEffectifier: ChildNodeEffectifier = function childNodeEffectifier(target, childNodes) {
  const newChildNodes: Node[] = elementEffectHandler(childNodes, textNodeHandler, (e) => e);
  newChildNodes.forEach((childNode) => {
   target.appendChild(childNode);
  });

  return newChildNodes;
 };

 generalElementEffectifier(
  childNodeEffectifier,
  scriptName,
  targetClassName,
 );
}
