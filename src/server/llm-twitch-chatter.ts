import * as WebSocket from 'ws';
import Queue from '../lib/util/queue';
import ollamaChatRequest from './server-util/ollama-chat-request';
import refreshTwitchAccessToken from './server-util/refresh-twitch-access-token';
import { token, refreshToken, clientId, clientSecret } from '../../secrets/twitch-chatbot.json';

const channelName = 'sillyinternettricks';

const msgPrefix = '';

let chatPercent = 1;

const chatAddress = 'ws://irc-ws.chat.twitch.tv:80';

let intervalId: NodeJS.Timeout;
let ws = new WebSocket(chatAddress);
let accessToken = token;
const queue = new Queue<string>();

const history: { role: string; content: string }[] = [];

const enqueueMessage = (msgId: string, editedMessage: string) => {
 const unquotedMessage = editedMessage.trim().replace(/^['"]/, '').replace(/['"]$/, '');
 if (unquotedMessage) {
  history.push({ role: 'assistant', content: unquotedMessage });
  const message = `@reply-parent-msg-id=${msgId} PRIVMSG #${channelName} :${msgPrefix}${unquotedMessage}`;
  console.log(`ATTN SENDING MSG: \x1b[1m\x1b[41m${message}\x1b[0m`);
  queue.enqueue(message);
 }
};

const ollamaCallback =
 (msgId: string, retry = true) =>
 (messagePiece: string) => {
  console.log(`\x1b[1m\x1b[45m${messagePiece}\x1b[0m`);
  const editedMessage = messagePiece.replace(/^\*+[\w\d-]+\*+:?/, '');
  if (!retry) {
   enqueueMessage(msgId, editedMessage.replace(/\([34][^)]+\)/, ''));
  } else if (100 * Math.random() < chatPercent) {
   if (editedMessage.length > 126) {
    ollamaChatRequest('chatter:latest', [
     {
      role: 'user',
      content: `The following response was much too long. Please summarize it very briefly using no more than 42 characters: ${editedMessage}`,
     },
    ]).then(ollamaCallback(msgId, false));
   } else {
    enqueueMessage(msgId, editedMessage);
   }
  }
 };

interface Listeners {
 onError?: (err: Error) => void;
 onClose?: (code: number, reason: Buffer) => void;
 onMessage?: (data: WebSocket.RawData) => void;
 onOpen?: () => void;
}
const listeners: Listeners = {};

const setupWs = () => {
 // we must stop any old interval that was running
 // because a new interval will be set when we get the on open event
 // (if we don't get an on open event after this, then something is wrong)
 clearInterval(intervalId);
 ws.on('error', listeners.onError);
 ws.on('close', listeners.onClose);
 ws.on('message', listeners.onMessage);
 ws.on('open', listeners.onOpen);
};

listeners.onError = (err: Error) => console.error(err.toString());
listeners.onClose = (code: number, reason: Buffer) => {
 console.warn(`ws closed: ${code} ${reason}`);

 // just reconnect if the code was 1006
 // eslint-disable-next-line eqeqeq
 if (code == 1006) {
  ws.close();
  ws = new WebSocket(chatAddress);
  setupWs();
 }
};

listeners.onMessage = (data: WebSocket.RawData) => {
 const msg = data.toString();
 console.log(msg);

 if (msg.match(/:Login authentication failed/)) {
  ws.close();
  refreshTwitchAccessToken(refreshToken, clientId, clientSecret).then((newToken) => {
   accessToken = newToken;
   ws = new WebSocket(chatAddress);
   setupWs();
  });
 }

 const msgMatchRe = new RegExp(`PRIVMSG #${channelName} :`);

 if (msg.match(msgMatchRe)) {
  const msgId = msg.match(/id=([\w\d-]+)/)[1];
  const message = msg
   .split('\r\n')
   .filter((e) => e.match(msgMatchRe))
   .map((e) => ({ role: 'user', content: e.split(`PRIVMSG #${channelName} :`)[1] }))
   .pop();

  history.push(message);

  ollamaChatRequest('chatter:latest', history.slice(-6)).then(ollamaCallback(msgId));
 }
};

listeners.onOpen = () => {
 ws.send(`PASS oauth:${accessToken}`);
 ws.send('NICK joshparkerj');
 ws.send(`JOIN #${channelName}`);
 ws.send('CAP REQ :twitch.tv/commands twitch.tv/membership twitch.tv/tags');

 intervalId = setInterval(() => {
  if (queue.size() > 0) {
   const message = queue.dequeue();
   ws.send(message);
   chatPercent -= 15;
  } else {
   chatPercent += 1;
  }

  console.log(`chat percent: ${chatPercent}`);
 }, 30000);
};

setupWs();
