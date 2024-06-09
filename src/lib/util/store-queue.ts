import Queue from './queue';

const storeQueue = function storeQueue<T>(key: string, value: Queue<T>) {
 console.log('storing queue', key, value);
 window.localStorage.setItem(key, value.toString());
};

const retrieveQueue = function retrieveQueue(key: string) {
 console.log('retrieving queue', key);
 const storedQueue = new Queue(window.localStorage.getItem(key));
 return storedQueue;
};

export { storeQueue, retrieveQueue };
