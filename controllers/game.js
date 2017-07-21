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
  res.render('game/play');
});

router.post('/join', function(req, res){
  res.send('Joining room', req.body);
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
        res.redirect('/');
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

module.exports = router;
