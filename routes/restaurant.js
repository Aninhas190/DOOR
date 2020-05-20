'user strict';

const { Router } = require('express');
const restaurantRouter = new Router();
// RouteGuards
const routeGuard = require('./../middleware/route-guard.js');
const routeGuardAdmin = require('./../middleware/route-guard-admin');
const routeGuardResOwner = require('./../middleware/route-guard-restaurant-owner');

const Restaurant = require('./../models/restaurant');
const ZOMATO_API_KEY = process.env.ZOMATO_API_KEY;
const Zomato = require('zomato.js');
const zomato = new Zomato(ZOMATO_API_KEY);

// Upload Images
const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multerStorageCloudinary({
  cloudinary,
  folder: 'door-restaurants-images'
});

const uploader = multer({ storage });



restaurantRouter.get('/', routeGuardResOwner, (req, res, next) => {
  const ownerId = req.user._id;
  Restaurant.find({ owner: ownerId })
    .then((restaurants) => res.render('restaurant/index', { restaurants }))
    .catch((error) => next(error));
});

//create by zomato ID
restaurantRouter.get('/createByZomatoId', routeGuardResOwner, (req, res) => {
  console.log(req.user);
  res.render('restaurant/createByZomatoId');
});

restaurantRouter.post('/createByZomatoId', (req, res, next) => {
  const ownerId = req.user;
  const zomatoRestaurantId = req.body.zomatoId;
  zomato
    .restaurant({ res_id: zomatoRestaurantId })
    .then((restaurantData) => {
      const longitude = parseFloat(restaurantData.location.longitude);
      const latitude = parseFloat(restaurantData.location.latitude);
      console.log(restaurantData);
      return Restaurant.create({
        name: restaurantData.name,
        location: {
          coordinates: [latitude, longitude]
        },
        cuisineType: restaurantData.cuisines,
        averagePrice: restaurantData.average_cost_for_two,
        contact: restaurantData.phone_numbers.split(' ').join(''),
        owner: ownerId
      }).then((restaurant) => {
        console.log(restaurant);
        res.render('restaurant/index', { restaurant });
      });
    })
    .catch((error) => next(error));
});

//manually
restaurantRouter.get('/create', routeGuardResOwner, (req, res) => {
  console.log(routeGuardResOwner);
  res.render('restaurant/create');
});

restaurantRouter.post('/create', uploader.single('image'), (req, res, next) => {
  console.log(req.file);
  const ownerId = req.user;
  const { name, description, latitude, longitude, cuisineType, contact } = req.body;
  const image = req.file.url;
  Restaurant.create({
    name,
    description,
    location: {
      coordinates: [latitude, longitude]
    },
    cuisineType,
    contact,
    image,
    owner: ownerId
  })
    .then((restaurant) => {
      console.log(restaurant);
      res.render('restaurant/index', { restaurant });
    })
    .catch((error) => next(error));
});

// List all restaurants
restaurantRouter.get('/list', (req, res, next) => {
  Restaurant.find()
    .then((restaurants) => {
      res.render('restaurant/list', { restaurants });
    })
    .catch((error) => next(error));
});

// View single restaurant
restaurantRouter.get('/:restaurantId', (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  Restaurant.findById(restaurantId)
    .then((restaurant) => res.render('restaurant/single', { restaurant }))
    .catch((error) => next(error));
});

//edit restaurant
restaurantRouter.get('/:restaurantId/edit', routeGuardResOwner, (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  Restaurant.findById(restaurantId)
    .then((restaurant) => res.render('restaurant/edit', { restaurant }))
    .catch((error) => next(error));
});

restaurantRouter.post('/:restaurantId/edit', routeGuardResOwner, (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  const { name, description, latitude, longitude, cuisineType, contact } = req.body;
  Restaurant.findByIdAndUpdate(restaurantId, {
    name,
    description,
    location: {
      coordinates: [latitude, longitude]
    },
    cuisineType,
    contact
  })
    .then((restaurant) => res.redirect('/restaurant'))
    .catch((error) => next(error));
});

//delete restaurant
restaurantRouter.get('/:restaurantId/delete', (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  Restaurant.findByIdAndDelete(restaurantId)
    .then((restaurant) => res.redirect('/restaurant'))
    .catch((error) => next(error));
});

// View menu for single restaurant
restaurantRouter.get('/:restaurantId/menu', (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  Restaurant.findById(restaurantId)
    .then((restaurant) => res.render('restaurant/menu', { restaurant }))
    .catch((error) => next(error));
});

module.exports = restaurantRouter;
