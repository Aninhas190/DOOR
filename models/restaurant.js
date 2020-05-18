'use strict';

const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [
      {
        type: Number,
        min: -180,
        max: 180
      }
    ]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  cuisineType: String,
  contact: {
    type: Number
  },
  averagePrice: {
    type: Number
  },
  menu: {
    dishName: {
      type: String
    },
    allergies: [{
      type: String,
      enum: ['gluten', 'celery', 'sesame', 'nuts', 'lupin', 'peanuts', 'fish', 'milk', 'mollusks', 'sulphites', 'crustaceans', 'wheat', 'mustard']
    }],
    dishDescription: String
  }
});

RestaurantSchema.index({ location: '2dshpere' });

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
