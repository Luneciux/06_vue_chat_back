const express = require("express");
const authMiddleware = require("../middlewares/auth");

const Message = require('../models/message');
const Room = require('../models/room');

const router = express.Router();

router.use(authMiddleware);

router.get('/rooms', async (req, res) => {
  try { 
    const rooms = await Room.find().populate(['admin']);

    res.send({ rooms });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading rooms' });
  }
});

router.get('/room/:roomId', async (req, res) => {
  try { 
    const room = await Room.findById(req.params.roomId).populate(['admin']);

    res.send({ room });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading messages' });
  }
});

router.post('/createRoom', async (req, res) => {
  try {
    const room = await Room.create({ ...req.body, admin: req.userId });

    return res.send({ room });
  } catch (err) {
    return res.status(400).send({ error: 'Error creating new room' });
  }
});

router.delete('/room/:roomId', async (req, res) => {
  try {
    const room = await Room.findByIdAndRemove(req.params.roomId);

    return res.send({ removed_room: room });
  } catch (err) {
    return res.status(400).send({ error: 'Error delting room' });
  }
});



//Funções relacionadas as mensagens 
//--------------------------------------------

//adiciona o relacionamento room - msg 
router.post('/:roomId', async (req, res) => {
  try {
    const message = await Message.create({ content: req.body.content, user: req.userId, room: req.params.roomId });

    return res.send({ message });
  } catch (err) {
    return res.status(400).send({ error: 'Error adding the message' });
  }
});

//As mensagens só fazem sentido dentro de um chat quando ele for aparecer no front end
router.get('/:roomId', async (req, res) => {
  try { 
    const { roomId } = req.params;

    const messages = await Message.find().populate('user');

    const room_messages = [{}];
    
    messages.forEach(msg => {
      if(msg.content !== null && msg.room == roomId)
        room_messages.push(msg);
    });
    
    res.send({ room_messages });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading messages' });
  }
});


router.delete('/roomMessages/:roomId', async (req, res) => {
  try { 
    const { roomId } = req.params;

    const messages = await Message.find()
    
    messages.forEach(async msg => {
      if(msg.room == roomId)
        await Message.findByIdAndRemove(msg._id);
    });
    
    res.send({ roomId });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading messages' });
  }
});

/*

retorna todas as mensagens relacionadas à uma sala para serem
carregadas no front com:
     - nome de quem enviou a mensagem
     - conteudo da mensagem 
     
*/



module.exports = app => app.use('/chat', router);