'user strict';

const { Router } = require('express');
const restaurantRouter = new Router();
const ZOMATO_API_KEY = process.env.ZOMATO_API_KEY;

const Restaurant = require('./../models/restaurant');
const Zomato = require('zomato.js');
const zomato = new Zomato(ZOMATO_API_KEY);

restaurantRouter.get('/', (req, res, next) => {
  res.render('restaurant/restaurant');
});
//by zomato ID
restaurantRouter.get('/createByZomatoId', (req, res, next) => {
  res.render('restaurant/createByZomatoId');
}); 

restaurantRouter.get('/createByZomatoId', (req, res, next) => {
  res.render('restaurant/create');
}); 

//manually
restaurantRouter.get('/create', (req, res, next) => {
  res.render('restaurant/create');
}); 

restaurantRouter.post('/create', (req, res, next) => {
  const { name, description, image, latitute, longitute, cuisineType, contact} = req.body;
});

restaurantRouter.get('/list', (req, res, next) => {
  res.render('restaurant/list');
});


module.exports = restaurantRouter;