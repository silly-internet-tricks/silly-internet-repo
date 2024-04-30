export default function pick<T>(collection: Set<T> | T[]) {
 if (!Array.isArray(collection)) {
  return pick([...collection]);
 }

 return collection[Math.floor(Math.random() * collection.length)];
}
