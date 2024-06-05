const storeMap = function storeMap<K, V>(key: string, value: Map<K, V>) {
 window.localStorage.setItem(key, JSON.stringify([...value.entries()]));
};

const retrieveMap = function retrieveMap(key: string) {
 return new Map(JSON.parse(window.localStorage.getItem(key)));
};

export { storeMap, retrieveMap };
