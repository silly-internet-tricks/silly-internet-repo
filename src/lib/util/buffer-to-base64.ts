export default function bufferToBase64(arraybuffer: ArrayBuffer) {
 return btoa(
  // this is based on the stack overflow answer: https://stackoverflow.com/a/9458996
  [...new Uint8Array(arraybuffer)].map((b) => String.fromCharCode(b)).join(''),
 );
}
