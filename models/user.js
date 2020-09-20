//FILENAME : User.js

// const mongoose = require("mongoose");
import mongoose from 'mongoose';
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  Address: {
      type: String,
      default: true
  },
  contactNumber: {
      type: Number,
      default: true
  }
});

// export model user with UserSchema
export default mongoose.model("user", UserSchema);