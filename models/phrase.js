'use strict';
module.exports = function(sequelize, DataTypes) {
  var phrase = sequelize.define('phrase', {
    word: DataTypes.STRING,
    img: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return phrase;
};