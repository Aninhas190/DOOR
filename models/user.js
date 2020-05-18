'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
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
          'gluten',
          'celery',
          'sesame',
          'nuts',
          'lupin',
          'peanuts',
          'fish',
          'milk',
          'mollusks',
          'sulphites',
          'crustaceans',
          'wheat',
          'mustard'
        ]
      }
    ],
    userType: {
      type: String,
      enum: ['foodie', 'restaurantOwner']
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

module.exports = mongoose.model('User', schema);
