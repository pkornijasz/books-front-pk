const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist/books-front-pk'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: '/dist/books-front-pk'})
);

app.listen(process.env.PORT || 8080);
