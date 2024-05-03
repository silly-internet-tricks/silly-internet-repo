const getStringFromChunk = (() => {
 const decoder = new TextDecoder();
 return function getUtf8StringFromChunk(chunk: Uint8Array) {
  return decoder.decode(chunk);
 };
})();

export default getStringFromChunk;
