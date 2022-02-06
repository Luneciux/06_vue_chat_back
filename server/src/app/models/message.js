const mongoose = require('../../database');

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  createdAt: {
    type: Date,
    requires: Date.now,
  },  
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;