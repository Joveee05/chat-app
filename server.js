const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'chatCordBot';

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

  socket.broadcast.emit(
    'message',
    formatMessage(botName, 'A user has joined the chat')
  );

  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat'));
  });

  socket.on('chatMessage', (message) => {
    io.emit('message', formatMessage('USER', message));
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
