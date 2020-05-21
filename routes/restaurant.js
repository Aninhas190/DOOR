'user strict';

const { Router } = require('express');
const restaurantRouter = new Router();
// RouteGuards
const routeGuard = require('./../middleware/route-guard.js');
const routeGuardAdmin = require('./../middleware/route-guard-admin');
const routeGuardResOwner = require('./../middleware/route-guard-restaurant-owner');

//models
const User = require('./../models/user');
const Restaurant = require('./../models/restaurant');
const Menu = require('./../models/menu');

//Zomato
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
  res.render('restaurant/createByZomatoId');
});

restaurantRouter.post('/createByZomatoId', (req, res, next) => {
  const ownerId = req.user;
  const zomatoRestaurantId = req.body.zomatoId;
  zomato
    .restaurant({ res_id: zomatoRestaurantId })
    .then((restaurantData) => {
      const image = restaurantData.thumb.split('?').splice(0, 1);
      const longitude = parseFloat(restaurantData.location.longitude);
      const latitude = parseFloat(restaurantData.location.latitude);
      return Restaurant.create({
        name: restaurantData.name,
        location: {
          coordinates: [latitude, longitude],
          address: restaurantData.location.address
        },
        image: image[0],
        cuisineType: restaurantData.cuisines,
        averagePrice: restaurantData.average_cost_for_two,
        contact: restaurantData.phone_numbers.split(' ').join(''),
        owner: ownerId
      }).then((restaurants) => {
        res.redirect('/restaurant');
      });
    })
    .catch((error) => next(error));
});

//manually
restaurantRouter.get('/create', routeGuardResOwner, (req, res) => {
  res.render('restaurant/create');
});

restaurantRouter.post('/create', uploader.single('image'), (req, res, next) => {
  const ownerId = req.user;
  const { name, description, latitude, longitude, cuisineType, contact, address } = req.body;
  const image = req.file.url;
  Restaurant.create({
    name,
    description,
    location: {
      coordinates: [latitude, longitude],
      address
    },
    cuisineType,
    contact,
    image,
    owner: ownerId
  })
    .then((restaurant) => {
      res.render('restaurant/index', { restaurant });
    })
    .catch((error) => next(error));
});

//List of all the restaurants
restaurantRouter.get('/list', (req, res, next) => {
  Restaurant.find()
    .then((restaurants) => {
      res.render('restaurant/list', { restaurants });
    })
    .catch((error) => next(error));
});

// List all restaurants where the user can eat
restaurantRouter.get('/yourlist', routeGuard, (req, res, next) => {
  let curatedListOfRest = [];
  const userAllergies = req.user.allergies;
  console.log('user allergies = ', userAllergies);
  Restaurant.find()
    .then((allRestaurants) => {
      return Menu.find().then((menus) => {
        for (let menu of menus) {
          if (!userAllergies.length) {
            curatedListOfRest.push(allRestaurants._id);
          } else if (!menu.allergies.includes(userAllergies)) {
            curatedListOfRest.push(menu.restaurantId);
          } 
        }
        return Restaurant.find({ _id: curatedListOfRest }).then((restaurants) =>
          res.render('restaurant/yourList', { restaurants })
        );
      });
    })
    .catch((error) => next(error));
});

// View single restaurant
restaurantRouter.get('/:restaurantId', (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  Restaurant.findById(restaurantId)
    .then((restaurant) => {
      console.log(restaurant);
      res.render('restaurant/single', { restaurant });
    })
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
  const { name, description, latitude, longitude, cuisineType, contact, address } = req.body;
  Restaurant.findByIdAndUpdate(restaurantId, {
    name,
    description,
    location: {
      coordinates: [latitude, longitude],
      address
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

restaurantRouter.get('/:restaurantId/addMenu', routeGuardResOwner, (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  Restaurant.findById(restaurantId)
    .then((restaurant) => res.redirect('/restaurant/menu'))
    .catch((error) => next(error));
});

restaurantRouter.post('/:restaurantId/addMenu', (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  const { dishName, allergies, dishDescription } = req.body;
  const restaurantMenu = [];
  Menu.create({
    restaurantId,
    dishName,
    allergies,
    dishDescription
  })
    .then((dishMenu) => {
      restaurantMenu.push(dishMenu);
      return restaurantMenu;
    })
    .then((restMenu) => {
      res.render('restaurant/menu', { restMenu });
    })
    .catch((error) => next(error));
});

restaurantRouter.get('/:restaurantId/menu/delete', (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  Menu.findOneAndDelete({ restaurantId })
    .then((dish) => res.redirect('/restaurant/menu'))
    .catch((error) => next(error));
});

// View menu for single restaurant
restaurantRouter.get('/:restaurantId/menu', (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  Menu.find({ restaurantId })
    .then((restMenu) => {
      res.render('restaurant/menu', { restMenu });
    })
    .catch((error) => next(error));
});

module.exports = restaurantRouter;
