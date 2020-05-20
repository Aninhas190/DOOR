'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'DOOR' });
});

router.get('/profile', routeGuard, (req, res, next) => {
  res.render('profile');
});

module.exports = router;
