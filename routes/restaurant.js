'user strict';

const { Router } = require('express');
const restaurantRouter = new Router();

const Restaurant = require('./../models/restaurant');

restaurantRouter.get('/', (req, res, next) => {
  res.render('restaurant/restaurant');
});

restaurantRouter.get('/create', (req, res, next) => {
  res.render('restaurant/create');
}); 

// restaurantRouter.post('/create', (req, res, next) => {
//   const { name, description, }
// })

module.exports = restaurantRouter;