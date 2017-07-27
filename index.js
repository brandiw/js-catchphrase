//Required Modules
var express = require('express');
var layouts = require('express-ejs-layouts');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var db = require('./models');
var router = require('./controllers/game');
var app = express();
var io = require('socket.io').listen(app.listen(process.env.PORT || 3000));

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

//Define some IO stuff
io.sockets.on("connection", function(socket){
  console.log("Connection!");
  socket.on('create', function(room) {
    socket.join(room);
  });

  socket.on('tick', function(room, time){
    io.sockets.in(room).emit('tick', time);
  });

  socket.on('flip', function(room, card){
    io.sockets.in(room).emit('flip', card);
  });

  socket.on('turn', function(room, team, color){
    io.sockets.in(room).emit('turn', team, color);
  });

  socket.on('point', function(room, scores){
    io.sockets.in(room).emit('point', scores);
  });

  socket.on('end', function(room, info){
    console.log('end backend', room, info);
    io.sockets.in(room).emit('end', info);
  });

  socket.on("disconnect", function(){
    console.log("Disconnection!");
  });
});

// Make io accessible to our router
app.use(function(req,res,next){
    req.io = io;
    next();
});

//Routes & Controllers
app.use('/game', router);

app.get('/', function(req, res){
  res.render('home');
});

module.exports = app;
