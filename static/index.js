const progress = document.getElementById('progressbar');
const sse = new EventSource('/events');
sse.addEventListener('progress', message => {
  progress.value = message.data;
});
sse.addEventListener('done', message => {
  sse.close();
});
