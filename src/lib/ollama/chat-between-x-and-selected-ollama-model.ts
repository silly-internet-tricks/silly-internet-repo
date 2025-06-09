import chatBetweenXAndOllama from './chat-between-x-and-ollama';
import selectOllamaModel from './select-ollama-model';

export default function chatBetweenXAndSelectedOllamaModel(
 chatMessageSelector: string | (() => Element[]),
 formSelectors: {
  textAreaSelector: string | ((s: string) => void) | (() => HTMLElement);
  sendButtonSelector: string | (() => HTMLElement);
 },
 roleCallback: (e: Element) => string,
 reverseMessageOrder?: boolean,
 getMessageText?: (e: Element) => string,
 customFillInput?: (e: Element, msg: string) => void,
 finishUp?: (e: Element) => void,
) {
 // TODO: what about the case where the desired ollama model is unavailable on the user's machine?
 const desiredOllamaModel: string = 'llama3:latest';
 const ollamaAddress: string = 'http://localhost:11434/';
 const getModel: () => string = selectOllamaModel(ollamaAddress, desiredOllamaModel);

 chatBetweenXAndOllama(
  getModel,
  ollamaAddress,
  chatMessageSelector,
  roleCallback,
  formSelectors,
  !!reverseMessageOrder,
  getMessageText,
  customFillInput,
  finishUp,
 );
}
