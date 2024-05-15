import { request } from 'node:http';
import mojibakeFix from './mojibake-fix';

interface Message {
 role: string;
 content: string;
}

export default function ollamaChatRequest(model: string, messages: Message[]) {
 return new Promise<string>((solve, ject) => {
  console.log(messages);

  const postData = JSON.stringify({
   model,
   messages,
   stream: false,
  });

  const req = request(
   {
    hostname: 'localhost',
    port: '11434',
    path: '/api/chat',
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
     'Content-Length': Buffer.byteLength(postData),
    },
   },
   (res) => {
    res.on('data', (chunk) => {
     const response = JSON.parse(chunk.toString());
     const {
      message: { content },
     } = response;

     solve(content.replace(/ð[^\s\p{Emoji_Presentation}]+/u, (match: string) => mojibakeFix(match)));
    });
   },
  );

  req.on('error', (err: Error) => ject(err));
  req.write(postData);
  req.end();
 });
}
