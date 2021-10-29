require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const logger = require('morgan');
const SwaggerUi = require('swagger-ui-express');

var passport = require('passport');
const authenticate = require('./authentication');

const specs = require('./swaggerOptions');
const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;
mongoose.connect(url);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully');
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const dishesRouter = require('./routes/dishesRouter');
const promotionsRouter = require('./routes/promotionsRouter');
const leadersRouter = require('./routes/leadersRouter');

const app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      'https://' + req.hostname + ':' + app.get('securePort') + req.url
    );
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Swagger UI
app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(specs));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    name: 'session_id',
    secret: 'mril12secr3t',
    saveUninitialized: false,
    resave: false,
    store: FileStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishesRouter);
app.use('/promotions', promotionsRouter);
app.use('/leaders', leadersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
