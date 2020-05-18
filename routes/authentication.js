'use strict';

const { Router } = require('express');

const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const authenticationRouter = new Router();

const routeGuard = require('../middleware/route-guard');

authenticationRouter.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

authenticationRouter.post('/sign-up', (req, res, next) => {
  const { name, email, password, userType } = req.body;

  let typeOfUser = () => {
    if (userType === 'foodie') {
      return typeOfUser = 'Foodie';
    } else {
      return typeOfUser = 'Restaurant Owner';
    }
  };

  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        email,
        passwordHash: hash,
        userType: typeOfUser
      });
    })
    .then((user) => {
      req.session.user = user._id;
      if (user.userType === 'foodie') {
        res.redirect('/foodie/edit');
      } else {
        res.redirect('/restaurant/create');
      }
    })
    .catch((error) => {
      next(error);
    });
});

authenticationRouter.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

authenticationRouter.post('/sign-in', (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then((result) => {
      if (result) {
        req.session.user = user._id;
        res.redirect('/private');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

authenticationRouter.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

authenticationRouter.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = authenticationRouter;
