import getStringFromChunk from './get-string-from-chunk';

export default function getJsonsFromChunk(chunk: Uint8Array) {
 const chunkString = getStringFromChunk(chunk);

 const responses = chunkString.split('}\n{');
 return responses
  .map((r, i) => `${i === 0 ? '' : '{'}${r}${i === responses.length - 1 ? '' : '}'}`)
  .map((e) => JSON.parse(e));
}
