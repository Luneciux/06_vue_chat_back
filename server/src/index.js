const { urlencoded } = require('body-parser');
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require('socket.io');
const io = new Server(server,  {
  cors: {
    origin: "https://luneciux-chat.herokuapp.com:8000" 
  }
});

app.use(express.json());
app.use(urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('ok');
});

require('./app/controllers/index')(app);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('update rooms', (room) => {
    io.emit('update rooms', room)
    console.log('update rooms')
  })

  socket.on('new message', (room) => {
    io.emit('new message', room)
    console.log('new message')
  })

  socket.on('new room connected', (room) => {
    io.emit('new room connected', room)
    console.log('new room connected')
  })

  socket.on('disconnected', (user) => {
    console.log(user.name, 'disconnected')
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(8000, () => {
  console.log('listening on *:8000')
});