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
const file = '../tailsapp.log';

io.of('tail').on('connection', (socket) => {
  fs.watchFile(file, () => {
    readlastlines.read(file, 5).then((lines) => socket.emit('filechanged', { text: lines }));
  });
});

/**
* Exports express
* @public
*/
module.exports = app;
