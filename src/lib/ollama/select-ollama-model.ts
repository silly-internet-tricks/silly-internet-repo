import insertCSS from '../util/insert-css';
import getOllamaModelList from './get-ollama-model-list';
import observeElementRemovalAndReaddIt from '../util/observe-element-removal-and-readd-it';

export default function selectOllamaModel(ollamaAddress: string, defaultModel: string) {
 insertCSS(`
 select#ollama-model {
     position: fixed;
     bottom: 2dvh;
     left: 1dvw;
     font-family: monospace;
     background-color:  black;
     color: chartreuse;
     padding: 1em;
 }
 `);

 let model: string = defaultModel;
 getOllamaModelList<{ models: { model: string }[] }>(ollamaAddress)
  .then((r) => r.response.models.map(({ model: taggedModel }) => taggedModel))
  .then((models) => {
   const select: HTMLSelectElement = document.createElement('select');
   models.forEach((m) => {
    const option: HTMLOptionElement = document.createElement('option');
    option.value = m;
    option.appendChild(new Text(m));

    if (m === model) {
     option.setAttribute('selected', 'selected');
    }

    select.appendChild(option);
   });

   select.id = 'ollama-model';

   select.addEventListener('change', ({ target }) => {
    const input: HTMLInputElement = target as HTMLInputElement;
    model = input.value;
   });

   document.body.appendChild(select);

   observeElementRemovalAndReaddIt(select);
  });

 return () => model;
}
