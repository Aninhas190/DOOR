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

module.exports = restaurantRouter;