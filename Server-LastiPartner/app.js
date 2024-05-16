var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const config = require('./config');

var authorizationRouter = require('./routes/authorization');
var profileRouter = require('./routes/profile');
var advertismentRouter = require('./routes/advertisment');


var app = express();


const url = 'mongodb+srv://yurikaletin:9Ew0a4V0PZquw68o@lasti.amgql16.mongodb.net/?retryWrites=true&w=majority&appName=Lasti';

mongoose.connect(url);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error to connection to Database:'));
db.once('open', function() { console.log('Connected to Database') });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/clientUploads', express.static(path.join(__dirname, 'clientUploads')));

app.use('/', authorizationRouter);
app.use('/profile', profileRouter);
app.use('/advertisment', advertismentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {message: err});
});

module.exports = app;