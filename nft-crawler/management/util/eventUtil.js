import {getFormattedAmount} from "./utils";

const models = require('../models');

export const createTrade = async function (event) {
    console.log('add trade =====>', event);
    // create send history
    let trade = new models.NftTrades();
    trade.nft = '0x977cc5eaa3adC6225d2cB9cb04c68dda6219BD54';
    trade.tokenId = event.returnValues.tokenId;
    trade.seller = event.returnValues.seller;
    trade.price = await getFormattedAmount(event.returnValues.price);
    trade.onSale = true;
    trade.txHash1 = event.transactionHash;

    trade = await trade.save();
    return trade;
}

export const updateTrade = async function (event) {
    const trade = await models.NftTrades.findToken('0x977cc5eaa3adC6225d2cB9cb04c68dda6219BD54', event.returnValues.tokenId);
    console.log('update trade =====>', trade);
    if (trade) {
        trade.nft = '0x977cc5eaa3adC6225d2cB9cb04c68dda6219BD54';
        trade.tokenId = event.returnValues.tokenId;
        trade.seller = event.returnValues.seller;
        trade.price = await getFormattedAmount(event.returnValues.price);
        trade.buyer = event.returnValues.buyer;
        trade.onSale = false;
        trade.txHash2 = event.transactionHash;

        await trade.save();
    }
}

export const deleteTrade = async function (event) {
    const trade = await models.NftTrades.findToken('0x977cc5eaa3adC6225d2cB9cb04c68dda6219BD54', event.returnValues.tokenId);
    console.log('delete event =====>', trade);
    if (trade) {
        trade.onSale = false;
        trade.txHash3 = event.transactionHash;
        await trade.save();
    }
}
