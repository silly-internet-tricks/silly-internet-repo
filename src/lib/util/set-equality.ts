export default function setEquality<T>(setA: Set<T>) {
 const { size } = setA;
 const elementListA = [...setA];
 return function setEquals(setB: Set<T>) {
  if (setB.size !== size) return false;

  if (elementListA.find((e) => !setB.has(e))) return false;

  return true;
 };
}
