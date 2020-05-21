'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const User = require('./../models/user');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'DOOR' });
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
      console.log('user', user);
      console.log('document', document);
      res.render('profile', { document, user });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
