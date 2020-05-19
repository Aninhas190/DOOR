'user strict';

const { Router } = require('express');
const restaurantRouter = new Router();

const Restaurant = require('./../models/restaurant');

const routeGuard = require('./../middleware/route-guard')

const ZOMATO_API_KEY = process.env.ZOMATO_API_KEY;
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
  //const restaurantId = req.body.zomatoId;
  console.log(req.body);
  /*zomato.restaurant({res_id: restaurantId})
  .then(data => {
    console.log(data);
  })
  .catch(error => next(error));*/
  res.redirect('/');
}); 

//manually
restaurantRouter.get('/create', routeGuard, (req, res, next) => {
  res.render('restaurant/create');
}); 

restaurantRouter.post('/create', (req, res, next) => {
  const ownerId = req.user;
  const { name, description, latitute, longitute, cuisineType, contact} = req.body;
  Restaurant.create({
    name,
    description,
    latitute,
    cuisineType,
    contact,
    owner: ownerId
  })
    .then(restaurant => res.render('restaurant/restaurant', {restaurant}))
    .catch(error=> next(error));
});

restaurantRouter.get('/list', (req, res, next) => {
  res.render('restaurant/list');
});


module.exports = restaurantRouter;