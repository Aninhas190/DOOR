'use strict';

const { join } = require('path');
const express = require('express');
const createError = require('http-errors');
const connectMongo = require('connect-mongo');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const logger = require('morgan');
const mongoose = require('mongoose');
const sassMiddleware = require('node-sass-middleware');
const serveFavicon = require('serve-favicon');
const hbs = require('hbs');
const hbsJson = require('hbs-json');

// Middleware
const basicAuthenticationDeserializer = require('./middleware/basic-authentication-deserializer.js');
const bindUserToViewLocals = require('./middleware/bind-user-to-view-locals.js');

// Routers
const indexRouter = require('./routes/index');
const authenticationRouter = require('./routes/authentication');
const userRouter = require('./routes/user');
const restaurantRouter = require('./routes/restaurant');

const app = express();

// Nodemailer
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'hbs');

//hbs
hbs.registerPartials(join(__dirname, 'views/partials'));
hbs.registerHelper('json', hbsJson);

app.use(serveFavicon(join(__dirname, 'public/images', 'favicon.ico')));
app.use(
  sassMiddleware({
    src: join(__dirname, 'public'),
    dest: join(__dirname, 'public'),
    outputStyle: process.env.NODE_ENV === 'development' ? 'nested' : 'compressed',
    force: process.env.NODE_ENV === 'development',
    sourceMap: true
  })
);
app.use(express.static(join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 15,
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    },
    store: new (connectMongo(expressSession))({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24
    })
  })
);
app.use(basicAuthenticationDeserializer);
app.use(bindUserToViewLocals);

app.use('/', indexRouter);
app.use('/authentication', authenticationRouter);
app.use('/foodie', userRouter);
app.use('/restaurant', restaurantRouter);

// Nodemailer
transporter
  .sendMail({
    from: `Demo App <${process.env.NODEMAILER_EMAIL}>`,
    to: 'lpf202005@gmail.com',
    subject: 'DOOR website - Verify your e-mail',
    html:
      'To complete the sign-up process, click here to <a href="http://localhost:3000">verify your email</a>'
  })
  .then((result) => {
    console.log('Email was sent successfully.');
    console.log(result);
  })
  .catch((error) => {
    console.log('There was an error sending the email.');
    console.log(error);
  });

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};
  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;
