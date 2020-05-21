'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const User = require('./../models/user');
const Restaurant = require('./../models/restaurant');

router.get('/', (req, res, next) => {
  Restaurant.find()
    .then((restaurants) => {
      res.render('index', { restaurants, title: 'DOOR' });
    })
    .catch((error) => next(error));
});

router.get('/profile', routeGuard, (req, res, next) => {
  let user;
  const userType = req.user.userType;

  User.findById(req.user._id)
    .then((document) => {
      user = document.toObject();
      if (userType === 'restaurantOwner') {
        user.isOwner = true;
      }
      res.render('profile', { document, user });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
