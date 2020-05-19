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
userRouter.get('/:userId/edit', (req, res, next) => {
  const userId = req.params.userId;
  const name = req.body.name;
  const type = req.body.type;

  Place.findById(userId).then((place) => {
    const name = req.params.name;
    const type = req.params.type;
    res.render('place/edit', { place });
  });
});

userRouter.post('/:userId/edit', (req, res, next) => {
  const userId = req.params.userId;
  Place.findById(userId).then((user) => {
    res.render('place/edit', { place });
  });
});

// userRouter.get('/edit', (req, res, next) => {
//   res.render('foodie/edit');
//   // res.render('foodie/edit', { checkedCelery: true });
// });

// userRouter.post('/edit', (req, res, next) => {
//   const allergies = req.body.allergies;
//   User.updateOne({ allergies })
//     .then((user) => {
//       res.redirect('/');
//     })
//     .catch((error) => next(error));
// });

module.exports = userRouter;
