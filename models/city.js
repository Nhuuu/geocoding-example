'use strict';
module.exports = (sequelize, DataTypes) => {
  const city = sequelize.define('city', {
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    long: DataTypes.DECIMAL,
    lat: DataTypes.DECIMAL
  }, {});
  city.associate = function(models) {
    // associations can be defined here
    models.city.belongsToMany(models.traveler, { through: 'cityTraveler' });
  };
  return city;
};