const mongoose = require('../../database');

const  bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    requires: true,
    select: false,
  },
  roles: [{
    type: String,
    required: true,
    lowercase: true,
  }],
  createdAt: {
    type: Date,
    requires: Date.now,
  }
});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;