import generalElementEffectifier from './general-element-effectifier';
import elementEffectHandler from './element-effect-handler';

export default function generalTextEffectifier(
 affectText: (t: string, length?: number) => Node[],
 scriptName?: string,
 targetClassName?: string,
) {
 let elementTextLength: number;
 const textNodeHandler: (
  target: Text,
  targetChildNodes: Node[],
  prevNodeWasText: boolean,
  length?: number,
 ) => Node[] = (textNode: Text, newChildNodes: ChildNode[], prevNodeWasText: boolean) => {
  if (prevNodeWasText) {
   newChildNodes.push(new Text(' '));
  }

  const affectedNodes: Node[] = affectText(textNode.textContent, elementTextLength);
  return affectedNodes;
 };

 type ChildNodeEffectifier = (target: Node, childNodes: ChildNode[], length?: number) => Node[];

 const childNodeEffectifier: ChildNodeEffectifier = function childNodeEffectifier(
  target,
  childNodes,
  length,
 ) {
  elementTextLength = length;
  const newChildNodes: Node[] = elementEffectHandler(childNodes, textNodeHandler, (e) => e);
  newChildNodes.forEach((childNode) => {
   target.appendChild(childNode);
  });

  return newChildNodes;
 };

 generalElementEffectifier(childNodeEffectifier, scriptName, targetClassName);
}
