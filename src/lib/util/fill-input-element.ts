// this is taken from https://stackoverflow.com/a/53797269

export default function fillInputElement(element: HTMLInputElement, value: string) {
 const previousValue: string = element.value;
 const newValue: string = previousValue + value;
 const valueSetter: (e: string) => void = Object.getOwnPropertyDescriptor(element, 'value').set;
 const prototypeValueSetter: (e: string) => void = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value').set;

 if (valueSetter !== prototypeValueSetter) {
  prototypeValueSetter.call(element, newValue);
 } else {
  // TODO: I want to check whether this can ever actually be called
  // the null check for valueSetter in the original code on stackoverflow looked questionable to me
  valueSetter.call(element, newValue);
 }

 element.dispatchEvent(new Event('input', { bubbles: true }));
}
