const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }, // This is the Full Name
  
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'                   
  },

  // ✅ NEW FIELDS FOR PROFILE PAGE
  phoneNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  bio: { type: String, default: '' },
  profilePicUrl: { type: String, default: '' } // We will store the image path here
});

module.exports = mongoose.model('User', UserSchema);