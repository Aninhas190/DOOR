'use strict';

const { Router } = require('express');
const userRouter = new Router();
const routeGuard = require('../middleware/route-guard');

const User = require('./../models/user');

// Route to view
userRouter.get('/', (req, res, next) => {
  res.render('foodie/index');
});

// Route to create allergy list

userRouter.get('/edit', routeGuard, (req, res, next) => {
  res.render('foodie/edit');
});

userRouter.post('/edit', (req, res, next) => {
  const allergies = req.body.allergies;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { allergies })
    .then((user) => {
      res.redirect('/profile');
    })
    .catch((error) => next(error));
});

module.exports = userRouter;
