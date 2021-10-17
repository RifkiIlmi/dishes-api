const { Router } = require("express");

const mongoose = require("mongoose");
const Dishes = require("../models/dishes");

const dishesRouter = Router();

dishesRouter
  .route("/")

  .get((req, res, next) => {
    Dishes.find({})
      .then(
        (data) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ data });
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  })

  .post((req, res, next) => {
    const dish = new Dishes(req.body);

    dish
      .save()
      .then((data) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  })

  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })

  .delete((req, res, next) => {
    Dishes.deleteMany({})
      .then((data) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  });

dishesRouter
  .route("/:dishId")

  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((data) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  })

  .post((req, res) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })

  .put((req, res) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((data) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  })

  .delete((req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
      .then((data) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ data });
      })
      .catch((err) => {
        next(err);
      });
  });

module.exports = dishesRouter;
