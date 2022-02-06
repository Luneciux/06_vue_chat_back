const mongoose = require('../../database');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    require: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  createdAt: {
    type: Date,
    requires: Date.now,
  },
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;