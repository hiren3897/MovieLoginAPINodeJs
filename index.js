// File : index.js
// mongodb+srv://product_user:Hiren@54321@productsapp.suf8l.mongodb.net/Users?retryWrites=true&w=majority

const express = require("express");
const bodyParser = require("body-parser");
const user = require("./routes/user"); 
const InitiateMongoServer = require("./config/db");
const path = require('path');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const moment = require('moment');

// import express from 'express';
// import bodyParser from 'body-parser';
// import user from './routes/user';
// import InitiateMongoServer from './config/db';
// import path from 'path';
// import morgan from 'morgan';
// import exphbs from 'express-handlebars';
// import moment from 'moment';


InitiateMongoServer();

const app = express();
app.use(morgan('dev'));

// PORT
const PORT = process.env.PORT || 4001;


// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
      formatDate: function (date, format) {
          return moment(date, "YYYYMMDD").fromNow();
      },
      isEmpty: (value) => {
          return value === '';
      },
      isNotEmpty: (value) => {
          return value !== '';
      }
  }
}));
app.set('view engine', '.hbs');

// Configure express to use handlebars templates
// var hbs = exphbs.create({
//   defaultLayout: 'main', //we will be creating this layout shortly
// });
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free'));


app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
app.use("/user", user);

app.use((req, res, next) => {
  const error = new Error('Not Found !');
  error.status = 404;
  next(error);
});

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});