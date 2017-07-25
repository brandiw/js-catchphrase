var express = require('express');
var db = require('../models');
var router = express.Router();

router
.get('/play', function(req, res){
  res.render('game/play');
})
.post('/play', function(req, res){
  console.log('post to play', req.body);
  res.send('posted to /game/play');
  //generate room id
  //redirect to active play route
});

router.get('/play/active/:id', function(req, res){
  db.phrase.findAll().then(function(phrases){
    var roomOpts = {
      team1: "Red Team",
      team2: "Green Team",
      team1Color: "fe1123",
      team2Color: "3bb219",
      roomId: req.params.id
    };
    res.render('game/activeGame', {roomOptions: roomOpts});
  });
});

router.post('/join', function(req, res){
  console.log('Joining room. req.body:', req.body);
  var roomDetails = {
    team1: "Red Team",
    team2: "Green Team",
    team1Color: "fe1123",
    team2Color: "3bb219",
    roomId: 'asdh'
  };
  res.render('game/observeRoom', {roomOptions: roomDetails})
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
