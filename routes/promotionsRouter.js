const { Router } = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authentication');

const Promotions = require('../models/promotions');
const promotionsRouter = Router();

promotionsRouter.use(bodyParser.json());

promotionsRouter
  .route('/')
  .get((req, res, next) => {
    Promotions.find({})
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
  .post(authenticate.verifyUser, (req, res, next) => {
    const promo = new Promotions(req.body);

    promo
      .save()
      .then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.deleteMany({})
      .then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  });

promotionsRouter
  .route('/:promotionId')
  .get((req, res, next) => {
    Promotions.findById(req.params.promotionId)
      .then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      'POST operation not supported on /promotions/' + req.params.promotionId
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promotionId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promotionId)
      .then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  });

module.exports = promotionsRouter;
