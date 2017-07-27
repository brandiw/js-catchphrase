'use strict';
module.exports = function(sequelize, DataTypes) {
  var game = sequelize.define('game', {
    room: DataTypes.STRING,
    team1: DataTypes.STRING,
    team2: DataTypes.STRING,
    color1: DataTypes.STRING,
    color2: DataTypes.STRING,
    score1: DataTypes.STRING,
    score2: DataTypes.STRING,
    skipped: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return game;
};