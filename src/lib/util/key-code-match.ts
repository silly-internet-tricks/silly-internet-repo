export default function keyCodeMatch(key: string, code: string) {
 return code === `${key.match(/\d/) ? 'Digit' : 'Key'}${key.toLocaleUpperCase()}`;
}
