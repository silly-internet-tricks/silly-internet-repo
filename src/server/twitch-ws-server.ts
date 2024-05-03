import { IncomingMessage, RequestListener, ServerResponse, createServer } from 'node:http';

import { Client, client as TmiClient } from 'tmi.js';

const sitClient: Client = new TmiClient({
 channels: ['sillyinternettricks'],
});

sitClient.connect();

const requestListener: RequestListener = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
 res.writeHead(200);
 console.log('connected to webpage');

 sitClient.on('message', (channel: string, tags: unknown, message: string) => {
  console.log(`Got twitch chat message: ${message}`);
  res.write(message);
 });
};

createServer(requestListener).listen(9821);
