export default function keyCodeMatch(key: string, code: string) {
 // maybe I should accept numpad as well
 return code === `${key.match(/\d/) ? 'Digit' : 'Key'}${key.toLocaleUpperCase()}`;
}
