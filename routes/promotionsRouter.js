const { Router } = require("express");
const bodyParser = require("body-parser");

const promotionsRouter = Router();

promotionsRouter.use(bodyParser.json());

promotionsRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })

  .get((req, res) => {
    res.end("Will show all the promotions to you!");
  })

  .post((req, res) => {
    res.end(
      "Will add the promotions: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })

  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })

  .delete((req, res) => {
    res.end("Deleting all promotions");
  });

promotionsRouter
  .route("/:promotionId")

  .get((req, res) => {
    res.end(
      "Will send details of the promotion: " +
        req.params.promotionId +
        " to you!"
    );
  })

  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /promotions/" + req.params.promotionId
    );
  })

  .put((req, res) => {
    res.write("Updating the promotion: " + req.params.promotionId + "\n");
    res.end(
      "Will update the promotion: " +
        req.body.name +
        " with description: " +
        req.body.description
    );
  })

  .delete((req, res) => {
    res.end("Deleting promotion: " + req.params.promotionId);
  });

module.exports = promotionsRouter;
