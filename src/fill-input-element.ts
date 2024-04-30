// this is taken from https://stackoverflow.com/a/53797269

export default function fillInputElement(element: HTMLElement, value: string) {
 const valueSetter: (e: string) => void = Object.getOwnPropertyDescriptor(element, 'value').set;
 const prototypeValueSetter: (e: string) => void = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value').set;

 if (valueSetter !== prototypeValueSetter) {
  prototypeValueSetter.call(element, value);
 } else {
  valueSetter.call(element, value);
 }

 element.dispatchEvent(new Event('input', { bubbles: true }));
}
