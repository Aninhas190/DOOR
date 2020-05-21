'use strict';

const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  dishName: {
    type: String,
    required: true
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
  price: {
    type: Number
  },
  dishDescription: String
});

const Menu = mongoose.model('Menu', MenuSchema);

module.exports = Menu;
