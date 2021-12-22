const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Error = sequelize.define('Error', {
    txHash: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    blockNumber: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false
    },
    xTxHash: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    fromChain: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    toChain: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    toAddress: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Error',
    timestamps: true
  });

  Error.save = async function () {
      return await this.create(this);
  };
  return Error;
};
