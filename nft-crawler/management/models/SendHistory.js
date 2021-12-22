const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const SendHistory = sequelize.define('SendHistory', {
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
    from: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    to: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    token: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: Sequelize.DataTypes.DOUBLE,
      allowNull: true
    },
    formattedAmount: {
      type: Sequelize.DataTypes.DOUBLE,
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
    xFrom: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    xTo: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    xToken: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    xAmount: {
      type: Sequelize.DataTypes.DOUBLE,
      allowNull: true
    },
    formattedXAmount: {
      type: Sequelize.DataTypes.DOUBLE,
      allowNull: true
    },
    status: {
      type: Sequelize.DataTypes.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'SendHistory',
    timestamps: true
  });

  SendHistory.findByTxHash = async function (txHash) {
    return await this.findOne({
      where: {
        txHash: txHash
      }
    });
  };
  SendHistory.save = async function () {
    if (this.isNewRecord){
      console.log('create', this);
      return await this.create(this);
    }
    else {
      console.log('update', this);
      return await this.update(this);
    }
  };
  return SendHistory;
};
