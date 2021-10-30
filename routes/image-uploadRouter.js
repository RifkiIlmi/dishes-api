const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authentication');
const multer = require('multer');

const storage = new multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('You can upload only image files!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  'imageFile'
);

const uploadRouter = express.Router();

uploadRouter.unsubscribe(bodyParser.json());

uploadRouter
  .route('/')
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return next(err);
      } else if (err) {
        // An unknown error occurred when uploading.
        return next(err);
      }

      if (!req.file) {
        const error = new Error('imageFile Field is Required!');
        error.status = 403;
        return next(error);
      }

      // Everything went fine.
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(req.file);
    });
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end('DELETE operation not supported on /imageUpload');
    }
  );

module.exports = uploadRouter;
