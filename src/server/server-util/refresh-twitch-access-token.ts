import { request } from 'node:https';

export default function refreshTwitchAccessToken(
 refreshToken: string,
 clientId: string,
 clientSecret: string,
) {
 return new Promise<string>((solve, ject) => {
  const postData = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`;
  console.log(postData);
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
     console.log(responseObject);
     console.log(res.statusCode);
     const token = responseObject.access_token;
     const newRefreshToken = responseObject.refresh_token;
     console.log(JSON.stringify({ token, refreshToken: newRefreshToken, clientId, clientSecret }));
     solve(token);
    });
   },
  );

  req.on('error', (err) => ject(err));

  req.write(postData);
  req.end();
 });
}
