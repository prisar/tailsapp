const express = require('express');
const fs = require('fs');
const readlastlines = require('read-last-lines');
const socketio = require('socket.io');
const { port, env } = require('./config/vars');

const app = express();

const io = socketio(8081);

app.use('/tail', express.static('public'));

// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

// file name that should be watched
const file = '~/logs/app.log';

io.of('tail').on('connection', (socket) => {
  fs.watchFile(file, () => {
    readlastlines.read(file, 10).then((lines) => socket.emit('filechanged', { text: lines, changedAt: Date().toString() }));
  });
});

/**
* Exports express
* @public
*/
module.exports = app;
