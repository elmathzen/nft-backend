const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const LastBlock = sequelize.define('LastBlock', {
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    number: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'LastBlock',
    timestamps: false
  });

  LastBlock.findByName = function (name) {
    return this.findOne({
      where: {
        name: name
      }
    });
  };

  return LastBlock;
};
