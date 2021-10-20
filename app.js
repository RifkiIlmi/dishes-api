var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const SwaggerUi = require("swagger-ui-express");

const specs = require("./swaggerOptions");
var mongoose = require("mongoose");

const url = "mongodb://localhost:27017/conFusion";
mongoose.connect(url);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishesRouter = require("./routes/dishesRouter");
var promotionsRouter = require("./routes/promotionsRouter");
var leadersRouter = require("./routes/leadersRouter");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Swagger UI
app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(specs));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const err = new Error("No Authorization in header");

    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    next(err);
    return;
  }

  const auth = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (auth[0] === "admin" && auth[1] === "rifki") {
    next();
  } else {
    const err = new Error("You are not authenticate");

    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    next(err);
    return;
  }
}

app.use(auth);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dishes", dishesRouter);
app.use("/promotions", promotionsRouter);
app.use("/leaders", leadersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
