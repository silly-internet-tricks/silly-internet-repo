import { writeFile } from 'node:fs/promises';
import { request } from 'node:https';
import { refreshToken, clientId, clientSecret } from '../../../secrets/twitch-chatbot.json';

export default function refreshTwitchAccessToken() {
 return new Promise<string>((solve, ject) => {
  const postData = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&clientSecret=${clientSecret}`;
  const req = request(
   {
    hostname: 'id.twitch.tv',
    port: 443,
    path: '/oauth2/token',
    method: 'POST',
    headers: {
     'Content-Type': 'application/x-www-form-urlencoded',
     'Content-Length': Buffer.byteLength(postData),
    },
   },
   (res) => {
    res.on('data', (chunk) => {
     const responseObject = JSON.parse(chunk.toString());
     const token = responseObject.access_token;
     const newRefreshToken = responseObject.refresh_token;
     writeFile(
      '../../../secrets/twitch-chatbot.json',
      JSON.stringify({ token, refreshToken: newRefreshToken, clientId, clientSecret }),
     )
      .then(() => {
       solve(token);
      })
      .catch((e) => ject(e));
    });
   },
  );

  req.on('error', (err) => ject(err));

  req.write(postData);
  req.end();
 });
}
