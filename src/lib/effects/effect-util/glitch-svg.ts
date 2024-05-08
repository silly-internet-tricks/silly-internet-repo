export default function glitchSvg(floods: number, id: string, scale: number = 100) {
 const randomRG = () =>
  Math.floor(Math.random() * 256 * 256)
   .toString(16)
   .padStart(4, '0')
   .toLocaleUpperCase();
 const randomFlood = (_: unknown, i: number) => `<feFlood width="100%" result="flood${i + 1}">
        <animate attributeName="y" from="${Math.random() * 100}%" to="${Math.random() * 100}%" dur="${
  Math.random() * 30
 }s" repeatCount="indefinite"></animate>
        <animate attributeName="height" from="${Math.random() * 20}" to="${Math.random() * 20}" dur="${
  Math.random() * 30
 }s" repeatCount="indefinite"></animate>
        <animate attributeName="flood-color" from="#${randomRG()}00" to="#${randomRG()}00" dur="${
  Math.random() * 30
 }s" repeatCount="indefinite"></animate>
        <animate attributeName="flood-opacity" from="${Math.random()}" to="${Math.random()}" dur="${
  Math.random() * 30
 }s" repeatCount="indefinite"></animate>
      </feFlood>`;
 const composite = (_: unknown, i: number) =>
  `<feComposite in="flood${i + 2}" in2="composite${i}" result="composite${i + 1}" />`;
 const createSVG = (n: number) => {
  if (n < 2) throw 'function does not support n less than 2';
  return `<svg width="200%" height="100%">
    <filter id="${id}">
      <feFlood flood-color="#7F7F00" width="100%" height="100%" result="flood0" />
      ${new Array(n).fill(null).map(randomFlood).join('')}
      <feComposite in="flood0" in2="flood1" result="composite0" />
      ${new Array(n - 2).fill(null).map(composite).join('')}
      <feDisplacementMap in="SourceGraphic" in2="flood" xChannelSelector="R" yChannelSelector="G" scale="${scale}" />
    </filter>
  </svg>`;
 };

 return createSVG(floods);
}
