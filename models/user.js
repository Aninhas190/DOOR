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
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

module.exports = mongoose.model('User', schema);
