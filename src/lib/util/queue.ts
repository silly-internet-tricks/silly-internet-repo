export default class Queue<T> {
 first: number = 0;

 last: number = 0;

 store: T[] = [];

 enqueue: (e: T) => void = (e) => {
  this.store.push(e);
  this.last += 1;
 };

 dequeue: () => T = () => {
  const e = this.store[this.first];
  delete this.store[this.first];
  this.first += 1;
  return e;
 };

 size: () => number = () => this.last - this.first;
}
