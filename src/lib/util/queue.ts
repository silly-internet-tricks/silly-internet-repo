export default class Queue<T> {
 constructor(s?: string) {
  if (!s) return;
  const newStore = JSON.parse(s);
  if (newStore && Array.isArray(newStore)) {
   // if there are nulls here, I will get rid of them.
   this.store = newStore.filter((e) => e);
   this.last = this.store.length;
  }
 }

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

 // when we stringify this, let's filter it to just the contents.
 toString: () => string = () => JSON.stringify(this.store.filter((e) => e));
}
