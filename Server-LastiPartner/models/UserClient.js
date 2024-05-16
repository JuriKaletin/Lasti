const mongoose = require('mongoose');


const userClientSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true 
    },
  username: { 
    type: String, 
    required: true 
    },
  password: { 
    type: String, 
    required: true 
    },
  phone: { 
    type: String 
    }
}, { versionKey: false });

const UserClient = mongoose.model('UserClient', userClientSchema);

module.exports = UserClient; 