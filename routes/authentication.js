'use strict';

const { Router } = require('express');

const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const authenticationRouter = new Router();

const routeGuard = require('../middleware/route-guard');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

const generateRandom = (length) => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

authenticationRouter.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

authenticationRouter.post('/sign-up', (req, res, next) => {
  const { name, email, password, userType } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        email,
        passwordHash: hash,
        userType,
        confirmationCode: generateRandom(10)
      });
    })
    // .then((user) => {
    //   req.session.user = user._id;
    //   if (user.userType === 'foodie') {
    //     res.redirect('/foodie/edit');
    //   } else {
    //     res.redirect('/restaurant/create');
    //   }
    // })
    .then((user) => {
      console.log('user', user);
      return transporter
        .sendMail({
          from: `DOOR App <${process.env.NODEMAILER_EMAIL}>`,
          to: user.email,
          subject: 'DOOR website - Verify your e-mail',
          html: `<p>To complete the sign-up process, click <a href="http://localhost:3000/authentication/confirm/${user.confirmationCode}">here</a>to verify your email</p>`
        })
        .then((result) => {
          console.log('Email was sent successfully.');
          console.log(result);
        })
        .catch((error) => {
          console.log('There was an error sending the email.');
          console.log(error);
        });
    })
    .catch((error) => {
      next(error);
    });
});

authenticationRouter.get('/confirm/:confirmationCode', (req, res) => {
  const confirmationCodeReturned = req.params.confirmationCode;
  console.log('req.user', req.user);
  res.render('index');
  if (confirmationCodeReturned === user.confirmationCode) {
    user.status = 'active';
  }
});

authenticationRouter.get('/log-in', (req, res) => {
  res.render('log-in');
});

authenticationRouter.post('/log-in', (req, res, next) => {
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
      req.session.user = user;
      if (result && user.userType === 'foodie') {
        res.redirect('/foodie');
      } else if (result && user.userType === 'restaurantOwner') {
        res.redirect('/restaurant');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

authenticationRouter.get('/profile', routeGuard, (req, res) => {
  res.render('profile');
});

authenticationRouter.post('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = authenticationRouter;
