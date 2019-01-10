'use strict';
module.exports = (sequelize, DataTypes) => {
  const cityTraveler = sequelize.define('cityTraveler', {
    cityId: DataTypes.INTEGER,
    travelerId: DataTypes.INTEGER
  }, {});
  cityTraveler.associate = function(models) {
    // associations can be defined here
  };
  return cityTraveler;
};