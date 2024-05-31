import * as WebSocket from 'ws';
import { IncomingMessage, RequestListener, ServerResponse, createServer } from 'node:http';
import { setupWs, Listeners } from './server-util/setup-ws';
import randomString from '../lib/util/random-string';

const channelName = 'sillyinternettricks';
const chatAddress = 'ws://irc-ws.chat.twitch.tv:80';
let ws = new WebSocket(chatAddress);

const listeners: Listeners = {
 onError: (err: Error) => console.error(err.toString()),

 onClose: (code: number, reason: Buffer) => {
  // TODO: try reusing this code which is copy-pasted from llm-twitch-chatter
  console.warn(`ws closed: ${code} ${reason}`);

  // just reconnect if the code was 1006
  // eslint-disable-next-line eqeqeq
  if (code == 1006) {
   ws.close();
   ws = new WebSocket(chatAddress);
   setupWs(ws, listeners);
  }
 },

 onMessage: (data: WebSocket.RawData) => {
  console.log(`Got twitch chat message: ${data.toString()}`);
 },

 onOpen: () => {
  console.log('opened websocket');
  const passMessage = `PASS ${randomString()}`;
  console.log('will send message: ', passMessage);
  ws.send(passMessage);
  const nickMessage = `NICK justinfan${Math.floor(Math.random() * 1000)
   .toString()
   .padStart(3, '0')}`;
  console.log('will send message: ', nickMessage);
  ws.send(nickMessage);
  const joinMessage = `JOIN #${channelName}`;
  console.log('will send message: ', joinMessage);
  ws.send(joinMessage);
 },
};

const requestListener: RequestListener = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
 res.writeHead(200);
 console.log('connected to webpage');

 ws.addEventListener('message', (event: WebSocket.MessageEvent) => {
  res.write(event.data.toString());
 });
};

createServer(requestListener).listen(9821);
setupWs(ws, listeners);
