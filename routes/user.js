// Filename : user.js

//const express = require("express");
//const { check, validationResult} = require("express-validator");
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
const router = express.Router();
//const auth = require("../middleware/auth");

//const User = require("../models/user");

import express from 'express';
//import {check, validationResult} from 'express-validator'
import pkg from 'express-validator';
const {check, validationResult} = pkg;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js'
import User from '../models/user.js'



var login = (req, res, msg = '') => {
  var error = false;

  User.find()
      .lean()
      .exec()
      .then(login => {
          res.render('movieViews/login', {
              login: login,
              error: error,
              msg: msg,
          });
      })
      .catch(err => {
          error = err;
          console.error(error);
      });
};


router.get('/', (req, res) =>{
  login(req, res);
});

router.get('/signup', (req, res) => {
  User.find()
      .lean()
      .exec()
      .then(signup => {
          res.render('movieViews/signup', {
            signup: signup
          });
      })
      .catch(err => {
          error = err;
          console.error(error);
      });
});
router.get('/home', (req, res) => {
  User.find()
      .lean()
      .exec()
      .then(home => {
          res.render('movieViews/home', {
            home: home
          });
      })
      .catch(err => {
          error = err;
          console.error(error);
      });
});

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */
router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
          min: 6
      }),
        check("Address","Please Enter valid Address").isString(),
        check("contactNumber", "please enter a valid phone Number").isMobilePhone()
        
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password,
            Address,
            contactNumber
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password,
                Address,
                contactNumber
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save().then(user => {
              res.redirect('/user/home')
            });

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
            
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.post(
    "/login",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 6
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { email, password } = req.body;
      try {
        let user = await User.findOne({
          email
        });
        if (!user)
          return res.status(400).json({
            message: "User Not Exist"
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({
            message: "Incorrect Password !"
          });
  
        const payload = {
          user: {
            id: user.id
          }
        };

        await user.save().then(user => {
          res.redirect('/user/home')
        });

  
        jwt.sign(
          payload,
          "randomString",
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token
            });
          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
  );

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /user/me
 */


router.get("/me", auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
  });

export default router;