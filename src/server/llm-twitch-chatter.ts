import * as WebSocket from 'ws';
import Queue from '../lib/util/queue';
import ollamaChatRequest from './server-util/ollama-chat-request';
import twitchChatbotToken from '../../secrets/twitch-chatbot-token';

const channelName = 'sillyinternettricks';

let chatFraction = 0.01;

const ws = new WebSocket('ws://irc-ws.chat.twitch.tv:80');
const queue = new Queue<string>();

const history: { role: string; content: string }[] = [];

const ollamaCallback =
 (msgId: string, retry = true) =>
 (messagePiece: string) => {
  console.log(`\x1b[1m\x1b[45m${messagePiece}\x1b[0m`);
  const editedMessage = messagePiece.replace(/^\*+[\w\d-]+\*+:?/, '');
  if (!retry) {
   history.push({ role: 'assistant', content: editedMessage });
   const message = `@reply-parent-msg-id=${msgId} PRIVMSG #${channelName} :${editedMessage}`;
   console.log(message);
   queue.enqueue(message);
  } else if (Math.random() < chatFraction) {
   if (editedMessage.length > 126) {
    ollamaChatRequest(
     JSON.stringify({
      model: 'chatter:latest',
      messages: [
       {
        role: 'user',
        content: `The following response was much too long. Please summarize it very briefly using no more than 42 characters: ${editedMessage}`,
       },
      ],
     }),
     ollamaCallback(msgId, false),
    );
   } else {
    history.push({ role: 'assistant', content: editedMessage });
    const message = `@reply-parent-msg-id=${msgId} PRIVMSG #${channelName} :${editedMessage}`;
    console.log(message);
    queue.enqueue(message);
   }
  }
 };

ws.on('error', (e) => console.error(e.toString()));
ws.on('close', (c) => console.warn(c.toString()));

ws.on('message', (m) => {
 const msg = m.toString();
 console.log(msg);
 const msgMatchRe = new RegExp(`PRIVMSG #${channelName} :`);

 if (msg.match(msgMatchRe)) {
  const msgId = msg.match(/id=([\w\d-]+)/)[1];
  const message = msg
   .split('\r\n')
   .filter((e) => e.match(msgMatchRe))
   .map((e) => ({ role: 'user', content: e.split(`PRIVMSG #${channelName} :`)[1] }))
   .pop();

  history.push(message);

  const postData = JSON.stringify({
   model: 'chatter:latest',
   messages: history.slice(-6),
  });

  ollamaChatRequest(postData, ollamaCallback(msgId));
 }
});

ws.on('open', () => {
 ws.send(`PASS oauth:${twitchChatbotToken}`);
 ws.send('NICK joshparkerj');
 ws.send(`JOIN #${channelName}`);
 ws.send('CAP REQ :twitch.tv/commands twitch.tv/membership twitch.tv/tags');

 setInterval(() => {
  if (queue.size() > 0) {
   const message = queue.dequeue();
   ws.send(message);
   chatFraction -= 0.01;
  } else {
   chatFraction += 0.01;
  }
 }, 10000);
});
