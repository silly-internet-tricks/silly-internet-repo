export default function getStringFromChunk(chunk: Uint8Array) {
 return [...chunk].map((b) => String.fromCharCode(b)).join('');
}
