const { Router } = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authentication');
const cors = require('./cors');

const Leaders = require('../models/leaders');
const leadersRouter = Router();

leadersRouter.use(bodyParser.json());

leadersRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Leaders.find({})
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
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      const leader = new Leaders(req.body);

      leader
        .save()
        .then((data) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ data });
        })
        .catch((err) => {
          next(err);
        });
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end('PUT operation not supported on /leaders');
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.deleteMany({})
        .then((data) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ data });
        })
        .catch((err) => {
          next(err);
        });
    }
  );

leadersRouter
  .route('/:leaderId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        'POST operation not supported on /leaders/' + req.params.leaderId
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.findByIdAndUpdate(
        req.params.leaderId,
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
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.findByIdAndDelete(req.params.leaderId)
        .then((data) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ data });
        })
        .catch((err) => {
          next(err);
        });
    }
  );

module.exports = leadersRouter;
