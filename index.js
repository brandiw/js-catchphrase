//Required Modules
var express = require('express');
var layouts = require('express-ejs-layouts');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var db = require('./models');
var app = express();

//Middleware & Stuff
app.use(session({
  secret: process.env.SESSION_SECRET || 'test',
  resave: false,
  saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());
app.use(function(req, res, next){
  res.locals.alerts = req.flash();
  next();
});

//Routes & Controllers
app.use('/game', require('./controllers/game'));

app.get('/', function(req, res){
  req.flash('success', 'Welcome to JS Catchphrase');
  res.render('home');
});

//Listen on default port 3000
app.listen(process.env.PORT || 3000);
