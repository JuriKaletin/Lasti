const mongoose = require('mongoose');


const userPartnerSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true 
    },
  companyName: { 
    type: String, 
    required: true 
    },
  password: { 
    type: String, 
    required: true 
    },
  phone: { 
    type: String 
    },
  city: { 
    type: String 
    },
  description: { 
    type: String 
    },
  equipment: { 
    type: String 
    },
  photo: { 
    type: String 
    },
}, { versionKey: false });

const UserPartner = mongoose.model('UserPartner', userPartnerSchema);

module.exports = UserPartner; 