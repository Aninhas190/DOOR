'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
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
    enum: ['foodie', 'restaurantOwner']
  }
});

module.exports = mongoose.model('User', schema);
