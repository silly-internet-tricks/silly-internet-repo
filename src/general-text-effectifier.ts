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

 type ChildNodeEffectifier = (target: Node, childNodes: ChildNode[]) => Node[];

 const childNodeEffectifier: ChildNodeEffectifier = function childNodeEffectifier(target, childNodes) {
  // we probably have to append the childNodes to the target here.
  const newChildNodes: Node[] = elementEffectHandler(childNodes, textNodeHandler, (e) => e);
  console.log(newChildNodes);
  newChildNodes.forEach((childNode) => {
   target.appendChild(childNode);
  });

  return newChildNodes;
 };

 generalElementEffectifier(
  childNodeEffectifier,
  scriptName,
  targetClassName,
  /* , (target) => target */
 );
}
