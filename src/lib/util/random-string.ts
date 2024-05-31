import pick from './pick';

export default function randomString(length = 10, charSet = 'abcdefghijklmnopqrstuvwxyz') {
 return new Array(length)
  .fill(' ')
  .map(() => pick([...charSet]))
  .join('');
}
