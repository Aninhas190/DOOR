'user strict';

const { Router } = require('express');
const adminRouter = new Router();
// RouteGuards
const routeGuardAdmin = require('./../middleware/route-guard-admin');
//models
const User = require('./../models/user');
const Restaurant = require('./../models/restaurant');
const Menu = require('./../models/menu');

adminRouter.get('/', routeGuardAdmin, (req, res, next) => {
  Restaurant.find()
    .then((restaurants) => res.render('restaurant/index', { restaurants }))
    .catch((error) => next(error));
});


module.exports = adminRouter;