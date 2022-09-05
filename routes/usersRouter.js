const { Router } = require('express');
const bodyParser = require('body-parser');
const Users = require('../models/users');
const passport = require('passport');
const authenticate = require('../authentication');
const cors = require('./cors');

const userRouter = Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get(
  '/',
  cors.cors,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Users.find({})
      .then(
        (data) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ data });
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  }
);

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
  Users.register(
    new Users({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err });
      } else {
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });
      }
    }
  );
});

userRouter.post(
  '/login',
  cors.corsWithOptions,
  passport.authenticate('local'),
  (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      token,
      status: 'You are successfully logged in!',
    });
  }
);

userRouter.get(
  '/facebook/token',
  passport.authenticate('facebook-token'),
  (req, res) => {
    if (req.user) {
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        token: token,
        status: 'You are successfully logged in!',
      });
    }
  }
);

userRouter.get('/logout', cors.corsWithOptions, (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = userRouter;
