'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('../middleware/route-guard');

//route to view
router.get('/user', (req, res, next) => {
  res.render('foodie');
});

//route to create user
module.exports = router;
