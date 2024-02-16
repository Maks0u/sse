# Server Sent Events

## Server

```bash
npm init
npm i express
touch server.js
```

> package.json
>
> ```diff
> +  "type": "module",
>    "scripts": {
> +    "start": "node server.js"
>    },
> ```

> server.js
>
> ```js
> import express from 'express';
> const app = express();
>
> app.get('/events', async (req, res) => {
>   res.setHeader('Content-Type', 'text/event-stream');
>   res.setHeader('Cache-Control', 'no-cache');
>   res.setHeader('Connection', 'keep-alive');
>
>   res.write('data: hello\n\n');
>   res.write('data: 1\n\n');
>   res.write('data: 2\n\n');
>   res.write('data: 3\n\n');
>
>   res.end();
> });
>
> app.listen(8888, () => console.log('server started'));
> ```

```bash
npm start
```

http://localhost:8888/events

## Progress bar

> server.js
>
> ```diff
>   import express from 'express';
>   const app = express();
>
> + app.use(express.static('./static'));
>
>   app.get('/events', async (req, res) => {
>     res.setHeader('Content-Type', 'text/event-stream');
>     res.setHeader('Cache-Control', 'no-cache');
>     res.setHeader('Connection', 'keep-alive');
>
> -   res.write('data: hello\n\n');
> -   res.write('data: 1\n\n');
> -   res.write('data: 2\n\n');
> -   res.write('data: 3\n\n');
> +   for (let i = 0; i <= 100; i++) {
> +     res.write(`event: progress\ndata: ${i}\n\n`);
> +     await new Promise(resolve => setTimeout(resolve, 25));
> +   }
> +   res.write(`event: done\ndata: done\n\n`);
>     res.end();
>   });
>
>   app.listen(8888, () => console.log('server started'));
> ```

```bash
mkdir static
touch static/index.html
touch static/index.js
```

> static/index.html
>
> ```html
> <!DOCTYPE html>
> <html>
>   <head>
>     <title>SSE progress bar</title>
>     <script defer src="index.js"></script>
>   </head>
>   <body>
>     <progress id="progressbar" max="100" value="0"></progress>
>   </body>
> </html>
> ```

> static/index.js
>
> ```js
> const progress = document.getElementById('progressbar');
> const sse = new EventSource('/events');
> sse.addEventListener('progress', message => {
>   progress.value = message.data;
> });
> sse.addEventListener('done', message => {
>   sse.close();
> });
> ```

```bash
npm start
```

http://localhost:8888/

## Nginx

> /etc/nginx/nginx.conf
>
> ```bash
> upstream sse-server {
>   server http://localhost:8888;
> }
>
> server {
>   listen       80;
>   server_name  localhost;
>
>   location / {
>     proxy_pass http://sse-server;
>   }
> }
> ```

> server.js
>
> ```diff
>   app.get('/events', async (req, res) => {
>     res.setHeader('Content-Type', 'text/event-stream');
>     res.setHeader('Cache-Control', 'no-cache');
>     res.setHeader('Connection', 'keep-alive');
> +   res.setHeader('X-Accel-Buffering', 'no');
> ```

http://localhost/
