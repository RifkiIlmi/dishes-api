const { Router } = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authentication');
const cors = require('./cors');

const Favorites = require('../models/favorites');
const favoriteRouter = Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    Favorites.find({})
      .populate('user')
      .populate('dishes')
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
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((data) => {
        if (!data) {
          const favorites = new Favorites({
            user: req.user._id,
          });

          for (const dish of req.body) {
            favorites.dishes.push(dish._id);
          }
          favorites.save().then(
            (result) => {
              Favorites.findById(result._id)
                .populate('user')
                .populate('dishes')
                .then((fav) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(fav);
                });
            },
            (err) => next(err)
          );
        } else {
          Favorites.findOne({ user: req.user._id }).then((favorite) => {
            req.body.filter((item, i, arr) => {
              if (!favorite.dishes.includes(item._id)) {
                favorite.dishes.push(item._id);
              }
            });
            favorite.save().then(
              (result) => {
                Favorites.findById(result._id)
                  .populate('user')
                  .populate('dishes')
                  .then((fav) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                  });
              },
              (err) => next(err)
            );
          });
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.deleteOne({ user: req.user._id })
      .then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  });

favoriteRouter
  .route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((favorite) => {
        if (!favorite.dishes.includes(req.params.dishId)) {
          favorite.dishes.push(req.params.dishId);
          favorite.save().then(
            (result) => {
              Favorites.findById(result._id)
                .populate('user')
                .populate('dishes')
                .then((fav) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(fav);
                });
            },
            (err) => next(err)
          );
        } else {
          err = new Error('Dish ' + req.params.dishId + ' is exists!');
          err.status = 403;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite != null) {
          var index = favorite.dishes.indexOf(req.params.dishId);
          favorite.dishes.splice(index, 1);
          favorite.save().then(
            (favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            },
            (err) => next(err)
          );
        } else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
