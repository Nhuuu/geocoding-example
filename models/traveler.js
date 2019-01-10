'use strict';
module.exports = (sequelize, DataTypes) => {
  const traveler = sequelize.define('traveler', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {});
  traveler.associate = function(models) {
    // associations can be defined here
    models.traveler.belongsToMany(models.city, { through: 'cityTraveler' });
  };
  return traveler;
};