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
    ref: 'User'
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  cuisineType: [
    {
      type: Array,
      enum: [
        'Alentejana',
        'American',
        'Angolan',
        'Arabian',
        'Argentine',
        'Austrian',
        'Author',
        'Bakery',
        'BBQ',
        'Belgian',
        'Beverages',
        'Brazilian',
        'British',
        'Burguer',
        'Cafe',
        'Canadian',
        'Cape Verdean',
        'Caribbean',
        'Chilean',
        'Chineses',
        'Coffee',
        'Contemporary',
        'Crepes',
        'Cuban',
        'Desserts',
        'Drinks Only',
        'Eastern European',
        'Fast Food',
        'Filipino',
        'Finger Food',
        'Fondue',
        'French',
        'Fresh Fish',
        'Fusion',
        'German',
        'Goan',
        'Gourmet Fast Food',
        'Greek',
        'Grill',
        'Healthy Food',
        'Ice Cream',
        'Indian',
        'International',
        'Iranian',
        'Irish',
        'Israeli',
        'Italian',
        'Japanese',
        'Jewish',
        'Juices',
        'Kebab',
        'Latin American',
        'Lebanese',
        'Madeiran',
        'Malaysian',
        'Mediterranean',
        'Mexican',
        'Middle Eastern',
        'Mineira',
        'Minhota',
        'Molecular',
        'Moroccan',
        'Mozambican',
        'Nepalese',
        'Oriental',
        'Pakistani',
        'Peruvian',
        'Pizza',
        'Portuguese',
        'Ramen',
        'Russian',
        'Santomean',
        'Seafood',
        'Snacks',
        'Spanish',
        'Steak',
        'Street Food',
        'Sushi',
        'Swedish',
        'Swiss',
        'Tapas',
        'Tea',
        'Thai',
        'Tibetan',
        'Transmontana',
        'Turkish',
        'Vegan',
        'Vegetarian',
        'Vietnamese'
      ]
    }
  ],
  contact: {
    type: String || Number
  },
  averagePrice: {
    type: Number
  },
  menuExists: {
    type: Boolean,
    default: false
  },
  menu: {
    dishName: {
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
    dishDescription: String
  }
});

RestaurantSchema.index({ location: '2dshpere' });

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
