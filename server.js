import express from 'express';
const app = express();
app.use(express.static('./static'));
app
  .get('/events', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // res.setHeader('X-Accel-Buffering', 'no');

    for (let i = 0; i <= 100; i++) {
      res.write(new ProgressEvent(i).toString());
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    res.write(new DoneEvent().toString());
    res.end();
  })
  .listen(8888, () => console.log('sse started'));

class Event extends String {
  constructor(type, data) {
    super(`event: ${type}\ndata: ${data}\n\n`);
  }
}
class ProgressEvent extends Event {
  constructor(data) {
    super('progress', data);
  }
}
class DoneEvent extends Event {
  constructor() {
    super('done', 'done');
  }
}
