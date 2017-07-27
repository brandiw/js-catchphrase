var express = require('express');
var Hashids = require("hashids");
var hashids = new Hashids("this is my salt");
var db = require('../models');
var router = express.Router();

router
.get('/play', function(req, res){
  res.render('game/play');
})
.post('/play', function(req, res){
  console.log('post to play', req.body);
  db.game.create({
    room: '',
    team1: req.body.team1,
    team2: req.body.team2,
    color1: req.body.team1_color,
    color2: req.body.team2_color
  }).then(function(game){
    //generate room id based on game id
    var hash = hashids.encode(game.id);
    console.log('hash', hash);
    game.room = hash;
    game.save().then(function(saved){
      //redirect to active play route
      res.redirect('/game/play/active/' + hash);
    });
  });
});

router.get('/play/active/:id', function(req, res){
  db.game.find({
    where: {room: req.params.id}
  }).then(function(room){
    res.render('game/activeGame', {roomOptions: room});
  }).catch(function(err){
    console.log('err', err);
  });
});

router.post('/join', function(req, res){
  console.log('Joining room. req.body:', req.body);
  db.game.find({
    where: {room: req.body.code}
  }).then(function(room){
    if(room && room.id){
      res.render('game/observeRoom', {roomOptions: room});
    }
    else {
      req.flash('error', 'No room was found with that ID');
      res.render('game/play');
    }
  }).catch(function(err){
    console.log('err', err);
  });
});

router.get('/phrases', function(req, res){
  db.phrase.findAll().then(function(phrases){
    var allPhrases = phrases || [];
    res.render('game/phrases', {phrases: allPhrases});
  });
});

router.get('/phrases/add', function(req, res){
  res.render('game/addPhrase');
});

router.post('/phrases/add', function(req, res){
  if(!req.body || !req.body.word || req.body.word.trim().length < 2){
    req.flash('error', 'You must add a non-blank phrase.');
    res.redirect('/game/phrase/add');
  }
  else{
    db.phrase.findOrCreate({
      where: {word: req.body.word},
      defaults: {
        img: req.body.img,
        description: req.body.description
      }
    }).spread(function(phrase, wasCreated){
      if(wasCreated){
        req.flash('success', 'You have added the phrase');
        res.redirect('/game/phrases');
      }
      else{
        req.flash('error', 'This phrase already exists!');
        res.redirect('/game/phrase/add');
      }
    }).catch(function(err){
      console.log('error', err);
      req.flash('error', 'Something went wrong.');
      res.redirect('/game/phrase/add');
    });
  }
});

router.get('/cards', function(req, res){
  db.phrase.findAll().then(function(phrases){
    res.send({cards: phrases.sort(function(){ return 0.5 - Math.random(); }) });
  });
});

router.post('/end', function(req, res){
  console.log('BODY', req.body);
  res.send('okay');
});

module.exports = router;
