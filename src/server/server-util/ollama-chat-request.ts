import { request } from 'node:http';

export default function ollamaChatRequest(postData: string, callback: (messagePiece: string) => void) {
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
   let messagePiece = '';
   res.on('data', (chunk) => {
    interface ollamaResponse {
     message: { content: string };
     done: boolean;
    }

    const response = chunk.toString();
    const pieces = response.split('}\n{');
    pieces
     .map((r: string, j: number) => `${j === 0 ? '' : '{'}${r}${j === pieces.length - 1 ? '' : '}'}`)
     .map((e: string) => JSON.parse(e.toString()))
     .forEach((e: ollamaResponse) => {
      const {
       message: { content },
       done,
      } = e;
      messagePiece += content;
      if (done) {
       callback(messagePiece);
      }
     });
   });
  },
 );

 console.log(postData);
 req.write(postData);
 req.end();
}
