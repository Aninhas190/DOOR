'use strict';

const { Router } = require('express');
const userRouter = new Router();
const routeGuard = require('../middleware/route-guard');

const User = require('./../models/user');

// Route to view
userRouter.get('/', (req, res, next) => {
  res.render('foodie/foodie');
});

// Route to create allergy list
userRouter.get('/edit', (req, res, next) => {
  res.render('foodie/edit');
});

userRouter.post('/edit', (req, res, next) => {
  const allergies = req.body.allergies;
  User.updateOne({ allergies })
    .then((user) => {
      res.redirect('/');
    })
    .catch((error) => next(error));
});



module.exports = userRouter;
