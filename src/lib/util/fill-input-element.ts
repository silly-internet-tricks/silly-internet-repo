// this is taken from https://stackoverflow.com/a/53797269

export default function fillInputElement(element: HTMLInputElement, value: string) {
 const previousValue: string = element.value;
 const newValue: string = previousValue + value;
 const prototypePropertyDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');
 const prototypeValueSetter: (e: string) => void = prototypePropertyDescriptor ? prototypePropertyDescriptor.set : Object.getOwnPropertyDescriptor(element, 'value').set;

 prototypeValueSetter.call(element, newValue);

 element.dispatchEvent(new Event('input', { bubbles: true }));
}
