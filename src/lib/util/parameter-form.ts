import observeElementRemovalAndReaddIt from './observe-element-removal-and-readd-it';
import insertCSS from './insert-css';

interface SliderParameter {
 val: number;
 min: number;
 max: number;
 step: number;
}

const formInput = (label: string, parameter: string[] | SliderParameter | boolean) => {
 if (Array.isArray(parameter)) {
  if (parameter.length < 10) {
   // this means we will insert radio buttons
   const buttons = parameter.map((radioValue) => {
    const div = document.createElement('div');
    const input = document.createElement('input');
    const labelElement = document.createElement('label');
    input.setAttribute('type', 'radio');
    input.setAttribute('id', radioValue);
    input.setAttribute('name', label);
    input.setAttribute('value', radioValue);
    labelElement.setAttribute('for', radioValue);
    labelElement.appendChild(new Text(radioValue));
    div.appendChild(input);
    div.appendChild(labelElement);
    return div;
   });

   const fieldset = document.createElement('fieldset');
   const legend = document.createElement('legend');
   legend.appendChild(new Text(label));
   buttons.forEach((button) => {
    fieldset.appendChild(button);
   });

   return fieldset;
  }

  // this means we will insert a dropdown
  const options = parameter.map((optionValue) => {
   const option = document.createElement('option');
   option.setAttribute('value', optionValue);
   option.appendChild(new Text(optionValue));
   return option;
  });

  const div = document.createElement('div');
  const labelElement = document.createElement('label');
  const select = document.createElement('select');
  labelElement.setAttribute('for', label);
  labelElement.appendChild(new Text(label));
  select.setAttribute('name', label);
  select.setAttribute('id', label);
  options.forEach((option) => select.appendChild(option));
  div.appendChild(labelElement);
  div.appendChild(select);
  return div;
 }

 if (typeof parameter === 'boolean') {
  // this means we will insert a toggle (checkbox)
  const div = document.createElement('div');
  const input = document.createElement('input');
  const labelElement = document.createElement('label');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('id', label);
  input.setAttribute('name', label);
  if (parameter) input.setAttribute('checked', 'true'); // TODO: look again to see what goes here (true or something else)
  labelElement.setAttribute('for', label);
  labelElement.appendChild(new Text(label));
  div.appendChild(input);
  div.appendChild(labelElement);
  return div;
 }

 // TODO: there will probably be more than one object type
 if (typeof parameter === 'object') {
  // this means we will insert a slider (unless other object types are added later)
  const div = document.createElement('div');
  const input = document.createElement('input');
  const labelElement = document.createElement('label');
  input.setAttribute('type', 'range');
  input.setAttribute('id', label);
  input.setAttribute('name', label);
  input.setAttribute('min', parameter.min.toString());
  input.setAttribute('max', parameter.max.toString());
  input.setAttribute('value', parameter.val.toString());
  input.setAttribute('step', parameter.step.toString());
  labelElement.setAttribute('for', label);
  labelElement.appendChild(new Text(label));
  div.appendChild(input);
  div.appendChild(labelElement);
  return div;
 }

 throw `parameter type not recognized! ${parameter}`;
};

export default function parameterForm(
 formName: string,
 parameters: Map<
  string, // this will be used as the label
  | string[] // radio button: array of strings
  | SliderParameter // slider
  | boolean // toggle: boolean
 >,
 callback: (parameterLabel: string, parameterValue: string | number | boolean) => void,
) {
 const formContainerId = 'silly-internet-parameter-form-container';
 insertCSS(`  
 #${formContainerId} { 
  position: fixed;
  left: 0.5em;
  top: 0.5em;
  background-color: yellow;
  height: fit-content;
  width: fit-content;
  z-index: 9001;
  border-radius: 0.5em;
 }
  `);

 const form = document.createElement('form');
 const h3 = document.createElement('h3');
 form.setAttribute('id', formName);
 form.appendChild(h3);
 [...parameters].forEach(([label, parameter]) => {
  form.appendChild(formInput(label, parameter));
 });

 console.log(parameters);
 console.log(callback);

 // do not recreate the form container if it already exists on the page
 let formContainer = document.getElementById(formContainerId);
 if (!formContainer) {
  formContainer = document.createElement('div');
  formContainer.id = formContainerId;
  document.body.appendChild(formContainer);
  observeElementRemovalAndReaddIt(formContainer);
 }

 const formSection = document.createElement('section');
 formSection.appendChild(form);
 formContainer.appendChild(formSection);
 observeElementRemovalAndReaddIt(formSection);
 // add event listeners
 [...formContainer.querySelectorAll('input,select')].forEach(
  (input: HTMLInputElement | HTMLSelectElement) => {
   input.addEventListener('change', () => {
    callback(input.name, input.value);
   });
  },
 );
}
