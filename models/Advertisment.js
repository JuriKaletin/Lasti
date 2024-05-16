const mongoose = require('mongoose');


const advertismentSchema = new mongoose.Schema({
  city: {
    type: String, 
    required: true 
    },
  address: {
    type: String, 
    required: true 
    },
  author: { 
    type: String, 
    required: true 
    },
  description: { 
    type: String 
    },
  likes: { 
    type: Array 
    },
  date: {
    type: Date,
    default: Date.now 
    }
}, { versionKey: false });

const Advertisment = mongoose.model('Advertisment', advertismentSchema);

module.exports = Advertisment; 