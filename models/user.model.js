const Joi = require('joi');
const mongoose = require('mongoose');

//user schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  isPractitioner: {
    type: Boolean
  },
  isAdmin: {
    type: Boolean
  },
  tenantId: {
    type: String,
    required: true,
  },
  userId: {
    type: String
  },
  fullName: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  appointments: [
    {
      start: String,
      end: String,
      clientId: String,
      practitionerId: String,
      notes: String,
      clientName: String,
      practitionerName: String
    }
  ],
});

const User = mongoose.model('User', UserSchema);

//function to validate user 
function validateUser(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
    isPractitioner: Joi.boolean(),
    isAdmin: Joi.boolean(),
    tenantId: Joi.string().required(),
    fullName: Joi.string().required(),
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;