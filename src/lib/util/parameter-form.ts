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
   const buttons = parameter.map(
    (radioValue) => `
  <div>
  <input
    type="radio"
    id="${radioValue}"
    name="${label}"
    value="${radioValue}">
  <label for="${radioValue}">${radioValue}</label>
  </div>
  `,
   );

   return `<fieldset><legend>${label}</legend>${buttons.join('')}</fieldset>`;
  }

  // this means we will insert a dropdown
  const options = parameter.map(
   (optionValue) => `
        <option value="${optionValue}">
          ${optionValue}
        </option>
      `,
  );

  return `<label for="${label}" >${label}</label><select name="${label}" id="${label}" >${options.join(
   '',
  )}</select>`;
 }

 if (typeof parameter === 'boolean') {
  // this means we will insert a toggle (checkbox)
  return `
  <div>
    <input
      type="checkbox"
      id="${label}"
      name="${label}"
      ${parameter ? 'checked' : ''}>
    <label for="${label}>${label}</label>
  </div>
  `;
 }

 // TODO: there will probably be more than one object type
 if (typeof parameter === 'object') {
  // this means we will insert a slider (unless other object types are added later)
  return `
  <div>
    <input
      type="range"
      id="${label}"
      name="${label}"
      min="${parameter.min}"
      max="${parameter.max}"
      value="${parameter.val}"
      step="${parameter.step}">
    <label for="${label}>${label}</label>
  </div>
  `;
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

 const formHtml = `
 <form id="${formName}">
  <h3>${formName}</h3>
  ${[...parameters].map(([label, parameter]) => formInput(label, parameter)).join('')}
 </form>

 `;

 console.log(parameters);
 console.log(callback);

 // do not recreate the form container if it already exists on the page
 let formContainer = document.getElementById(formContainerId);
 if (!formContainer) {
  formContainer = document.createElement('div');
  formContainer.id = formContainerId;
  document.body.appendChild(formContainer);
 }

 const formSection = document.createElement('section');
 formSection.innerHTML = formHtml;
 formContainer.appendChild(formSection);
 // add event listeners
 [...formContainer.querySelectorAll('input,select')].forEach(
  (input: HTMLInputElement | HTMLSelectElement) => {
   input.addEventListener('change', () => {
    callback(input.name, input.value);
   });
  },
 );
}
