const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = function(sequelize, DataTypes) {
  const NftTrades = sequelize.define('NftTrades', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nft: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    tokenId: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    seller: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    onSale: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: true
    },
    buyer: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    txHash1: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    txHash2: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    txHash3: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'NftTrades',
    timestamps: true
  });

  NftTrades.findByTxHash = async function (txHash) {
    return await this.findOne({
      where: {
        [Op.or]: [{txHash1: txHash}, {txHash2: txHash}, {txHash3: txHash}]
      }
    });
  };
  NftTrades.findToken = async function (nft, tokenId) {
    return await this.findOne({
      where: {
        nft: nft,
        tokenId: tokenId
      }
    });
  };
  NftTrades.save = async function () {
    if (this.isNewRecord){
      console.log('create', this);
      return await this.create(this);
    }
    else {
      console.log('update', this);
      return await this.update(this);
    }
  };
  return NftTrades;
};
