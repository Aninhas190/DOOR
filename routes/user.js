'use strict';

const { Router } = require('express');
const userRouter = new Router();
const routeGuard = require('../middleware/route-guard');

//route to view
userRouter.get('/foodie', (req, res, next) => {
  res.render('foodie');
});

//route to create user
module.exports = userRouter;
