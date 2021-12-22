import {getFormattedAmount} from "./utils";

const models = require('../models');

export const createHistory = async function (event, isEth) {
    console.log('=====', event);
    // create send history
    let history = new models.SendHistory();
    history.txHash = event.transactionHash;
    history.blockNumber = event.blockNumber;
    history.from = event.returnValues.to;
    history.to = event.address;
    // history.amount = receipt.
    if (isEth) {
        history.fromChain = 'ETH';
        history.toChain = 'Klaytn';
    } else {
        history.fromChain = 'Klaytn';
        history.toChain = 'ETH';
    }
    history.token = event.returnValues.token;
    history.amount = event.returnValues.amount;
    history.formattedAmount = await getFormattedAmount(history.token, history.amount, isEth);
    history.status = false;

    history = await history.save();
    return history;
}

export const update = async function (event, isETH) {
    const history = await models.SendHistory.findByTxHash(event.returnValues.txHash);
    console.log('update event =====>', history, event.returnValues.txHash);
    if (history) {
        history.xTxHash = event.transactionHash;
        history.xFrom = event.address;
        history.xTo = event.returnValues.to;
        history.xToken = event.returnValues.token;
        history.xAmount = event.returnValues.amountOut;
        history.formattedXAmount = await getFormattedAmount(history.xToken, history.xAmount, isETH);
        history.status = true;

        await history.save();
    }
}

export const createError = async function (event, err, isEth) {
    const error = new models.Error();
    error.txHash = event.transactionHash;
    error.blockNumber = event.blockNumber;
    if (err.receipt) {
        error.xTxHash = err.receipt.transactionHash;
    }
    if (isEth) {
        error.fromChain = 'ETH';
        error.toChain = 'Klaytn';
    } else {
        error.fromChain = 'Klaytn';
        error.toChain = 'ETH';
    }
    error.message = err.message;
    error.toAddress = event.returnValues.to;
    await error.save();
}