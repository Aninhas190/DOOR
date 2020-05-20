'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String
  },
  allergies: [
    {
      type: String,
      enum: [
        'Gluten',
        'Celery',
        'Sesame',
        'Nuts',
        'Lupin',
        'Peanuts',
        'Fish',
        'Milk',
        'Soybeans',
        'Eggs',
        'Mollusks',
        'Sulphites',
        'Crustaceans',
        'Wheat',
        'Mustard'
      ]
    }
  ],
  userType: {
    type: String,
    enum: ['foodie', 'restaurantOwner', 'admin']
  },
  confirmationCode: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  }
});

module.exports = mongoose.model('User', schema);
