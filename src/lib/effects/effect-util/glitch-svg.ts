export default function glitchSvg(floods: number, id: string, wiggle = false, scale: number = 100) {
 // TODO: move most parameters out of this file (so that the caller can configure them)
 const changeGlitchSpeed = (multiplier: number) =>
  [...document.querySelectorAll(`#${id} animate[attributeName=y]`)].forEach((animateElement) =>
   animateElement.setAttribute(
    'dur',
    // TODO: see if there's a more efficient way to track these durations rather than attribute using a regexp
    (Number(animateElement.getAttribute('data-original-dur').match(/[\d.]+/)[0]) / multiplier).toString(),
   ),
  );

 const randomRG = () =>
  Math.floor(Math.random() * 256 * 256)
   .toString(16)
   .padStart(4, '0')
   .toLocaleUpperCase();

 const randomFlood = (_: unknown, i: number) => {
  const animationDurs = new Array(4).fill(0).map(() => Math.random() * 30);
  return `<feFlood width="100%" result="flood${i + 1}">
        <animate attributeName="y" from="${Math.random() * 100}%" to="${Math.random() * 100}%" dur="${
   animationDurs[0]
  }s" repeatCount="indefinite" data-original-dur="${animationDurs[0]}"></animate>
        <animate attributeName="height" from="${Math.random() * 20}" to="${Math.random() * 20}" dur="${
   animationDurs[1]
  }s" repeatCount="indefinite" data-original-dur="${animationDurs[1]}"></animate>
        <animate attributeName="flood-color" from="#${randomRG()}00" to="#${randomRG()}00" dur="${
   animationDurs[2]
  }s" repeatCount="indefinite" data-original-dur="${animationDurs[2]}"></animate>
        <animate attributeName="flood-opacity" from="${Math.random()}" to="${Math.random()}" dur="${
   animationDurs[3]
  }s" repeatCount="indefinite" data-original-dur="${animationDurs[3]}"></animate>
      </feFlood>`;
 };

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
      ${
       wiggle
        ? `
      <feTurbulence type="fractalNoise" result="noise">
        <animate attributeName="baseFrequency" from="0.0" to="1.0" dur="60s" repeatCount="indefinite"></animate>
      </feTurbulence>
      <feDisplacementMap in2="noise" in="composite${
       floods - 2
      }" xChannelSelector="R" yChannelSelector="G" scale="${scale / 2}" />`
        : ''
      }
      <feDisplacementMap in="SourceGraphic" xChannelSelector="R" yChannelSelector="G" scale="${scale}" />
    </filter>
  </svg>`;
 };

 return {
  svg: createSVG(floods),
  changeGlitchSpeed,
 };
}
