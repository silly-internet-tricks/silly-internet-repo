import * as WebSocket from 'ws';
import { IncomingMessage, RequestListener, ServerResponse, createServer } from 'node:http';
import { setupWs, Listeners } from './server-util/setup-ws';
import randomString from '../lib/util/random-string';

const channelName = 'sillyinternettricks';
const chatAddress = 'ws://irc-ws.chat.twitch.tv:80';
let ws = new WebSocket(chatAddress);

let nick: string;

const messageEventListeners: ((event: WebSocket.MessageEvent) => void)[] = [];

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
   messageEventListeners.forEach((eventListener) => {
    ws.addEventListener('message', eventListener);
   });
  }
 },

 onMessage: (data: WebSocket.RawData) => {
  console.log(`Got twitch chat message: ${data.toString()}`);
 },

 onOpen: () => {
  // got the pass message and nick message from: https://discuss.dev.twitch.com/t/anonymous-connection-to-twitch-chat/20392/8
  // (i confirmed that using a random string in place of "justinfan" is not accepted)
  const passMessage = `PASS ${randomString()}`;
  nick = `justinfan${Math.floor(Math.random() * 1000)
   .toString()
   .padStart(3, '0')}`;

  const nickMessage = `NICK ${nick}`;
  const joinMessage = `JOIN #${channelName}`;
  console.log('Opened websocket! Will send: ', passMessage, nickMessage, joinMessage);
  ws.send(passMessage);
  ws.send(nickMessage);
  ws.send(joinMessage);
 },
};

const requestListener: RequestListener = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
 res.writeHead(200);
 console.log('connected to webpage');

 const eventListener = (event: WebSocket.MessageEvent) => {
  try {
   const data = event.data.toString();
   console.log(data);
   if (data.match(/PRIVMSG/)) {
    const username = data.match(/:(.*)!/)[1];

    // some messages seem to come from my own username. Let's skip those.
    if (username === nick) {
     console.log('message from me');
     return;
    }

    console.log('username: ', username);
    const message = data.match(/:([^:]*)$/)[1];
    console.log('message: ', message);
    res.write(JSON.stringify({ message, username }));
   }
  } catch (e) {
   console.error(e);
  }
 };

 messageEventListeners.push(eventListener);

 ws.addEventListener('message', eventListener);
};

createServer(requestListener).listen(9821);
setupWs(ws, listeners);
