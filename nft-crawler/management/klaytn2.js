import {getEthWeb3} from "./util/awskms";
import { ethBridge, klayBridge, ethAddr, klayAddr, talAddr, ktalAddr } from './util/constants'
import {updateKlaytnLastBlockNumber, selectKlaytnLastBlockNumber} from "./util/lastBlockHandler";
// import {approve} from "./util/approveUtil";
import {createError, createHistory, update} from "./util/eventUtil";

const Web3 = require('web3');
const models = require('./models');

const bridgeAbi = require('./abis/bridge.json');
// const erc20Abi =  require('./abis/erc20.json');

export async function executeKlaytn(history) {
    let web3 = new Web3(process.env.KLAYTN_NODE);
    const klayBridgeContract = new web3.eth.Contract(bridgeAbi, klayBridge);

    await klayBridgeContract.getPastEvents('allEvents', {fromBlock: history.blockNumber, toBlock: history.blockNumber})
        .then(async function (events) {
            for(let i = 0; i < events.length; i++){
                if (events[i].transactionHash === history.txHash) {
                    if (events[i].event !== 'XswapExactTokensForTokens' && events[i].event !== 'XswapExactTokensForETH' &&
                        events[i].event !== 'XswapExactTokensForTokensSupportingFeeOnTransferTokens' &&
                        events[i].event !== 'XswapExactTokensForETHSupportingFeeOnTransferTokens' &&
                        events[i].event !== 'XswapExactTaalForTaal'
                    ){
                        await sendToEth(events[i], true);
                        console.log('resending transaction complete.', events[i].event, events[i].transactionHash);
                    } else {
                        console.log('resending transaction not found.', events[i]);
                    }
                }
            }
        });
}

export async function sendToEth(event, isManual) {
    const result = event.returnValues;
    console.log('sendToEth');
    if (!isManual) {
        try{
            const history = await createHistory(event, false);
            console.log('11111', history);
        } catch (e) {
            console.log(e);
            return;
        }
    }

    const web3 = getEthWeb3();
    // console.log('=====>', caver);
    // const accounts = await caver.klay.getAccounts();
    const accounts = await web3.eth.getAccounts();
    const tmp = await web3.eth.getBalance(accounts[0]);
    console.log('account eth balance = ', accounts[0], tmp);
    // const token1 = new web3.eth.Contract(erc20Abi, result.pathx[0]);
    // await approve(ethRouter, token1, accounts[0]);
    // const token2 = new web3.eth.Contract(erc20Abi, result.pathx[result.pathx.length - 1]);
    // await approve(ethRouter, token2, accounts[0]);

    const ethBridgeContract = new web3.eth.Contract(bridgeAbi, ethBridge);
    try {
        const deadline = new Date().getTime() + 10000;
        let method;
        const isETH = result.pathx[result.pathx.length - 1].toLowerCase() === ethAddr.toLowerCase()
            || result.pathx[result.pathx.length - 1].toLowerCase() === klayAddr.toLowerCase();
        const isTAL = result.pathx[result.pathx.length - 1].toLowerCase() === talAddr.toLowerCase()
                   || result.pathx[result.pathx.length - 1].toLowerCase() === ktalAddr.toLowerCase();

        if (event.event === 'SwapExactTaalForTaal')
        {
            console.log('xswapExactTaalForTaal method call');
            console.log(result.amountIn, result.amountOutMin, result.to, result.pathx);

            if (isTAL) {
                method = ethBridgeContract.methods.xswapExactTaalForTaal(
                    result.amountIn,
                    result.amountOutMin,
                    result.pathx,
                    result.to,
                    deadline,
                    event.transactionHash
                );
            } else {
                if (isETH) {
                    // 아래 순서로 estimate gas에서 에러가 없는 것 실행... 어떻게 ?
                    method = ethBridgeContract.methods.xswapExactTokensForTokens(
                        result.amountIn,
                        result.amountOutMin,
                        result.pathx,
                        result.to,
                        deadline,
                        event.transactionHash
                    );
                    // method = ethBridgeContract.methods.xswapExactTokensForTokensSupportingFeeOnTransferTokens(
                    //     result.amountIn,
                    //     result.amountOutMin,
                    //     result.pathx,
                    //     result.to,
                    //     deadline,
                    //     event.transactionHash
                    // );
                } else {
                    // 아래 순서로 estimate gas에서 에러가 없는 것 실행... 어떻게 ?
                    console.log('xswapExactTokensForTokens method call');
                    method = ethBridgeContract.methods.xswapExactTokensForTokens(
                        result.amountIn,
                        result.amountOutMin,
                        result.pathx,
                        result.to,
                        deadline,
                        event.transactionHash
                    );
                    // console.log('xswapExactTokensForTokensSupportingFeeOnTransferTokens method call');
                    // method = ethBridgeContract.methods.xswapExactTokensForTokensSupportingFeeOnTransferTokens(
                    //     result.amountIn,
                    //     result.amountOutMin,
                    //     result.pathx,
                    //     result.to,
                    //     deadline,
                    //     event.transactionHash
                    // );
                }
            }
        }
        else if (event.event === 'SwapExactETHForTokens' || event.event === 'SwapExactTokensForTokens')
        {
            console.log('xswapExactTokensForTokens method call');
            console.log(result.amountIn, result.amountOutMin, result.to, result.pathx);

            method = ethBridgeContract.methods.xswapExactTokensForTokens(
                result.amountIn,
                result.amountOutMin,
                result.pathx,
                result.to,
                deadline,
                event.transactionHash
            );
        }
        else if (event.event === 'SwapExactTokensForTokensSupportingFeeOnTransferTokens'
                || event.event === 'SwapExactETHForTokensSupportingFeeOnTransferTokens')
        {
            console.log('xswapExactTokensForTokensSupportingFeeOnTransferTokens method call');
            console.log(result.amountIn, result.amountOutMin, result.to, result.pathx);

            method = ethBridgeContract.methods.xswapExactTokensForTokensSupportingFeeOnTransferTokens(
                result.amountIn,
                result.amountOutMin,
                result.pathx,
                result.to,
                deadline,
                event.transactionHash
            );
        }
        else if (event.event === 'SwapExactTokensForETH')
        {
            console.log('xswapExactTokensForETH method call');
            console.log(result.amountOut, result.amountInMax, result.to, result.pathx);

            method = await ethBridgeContract.methods.xswapExactTokensForETH(
                result.amountIn,
                result.amountOutMin,
                result.pathx,
                result.to,
                deadline,
                event.transactionHash
            );
        }
        else if (event.event === 'SwapExactTokensForETHSupportingFeeOnTransferTokens')
        {
            console.log('xswapExactTokensForETHSupportingFeeOnTransferTokens method call');
            console.log(result.amountOut, result.amountInMax, result.to, result.pathx);

            method = await ethBridgeContract.methods.xswapExactTokensForETHSupportingFeeOnTransferTokens(
                result.amountIn,
                result.amountOutMin,
                result.pathx,
                result.to,
                deadline,
                event.transactionHash
            );
        }

        const gasAmount = await method.estimateGas({from: accounts[0]}).catch(async (e) => {
            console.log('estimateGas fail.', e);
            await createError(event, e, true);
            return;
        });
        // console.log('======>>>>', gasAmount);
        const receipt = await method
            .send({
                from: accounts[0],
                gas: gasAmount,
                value: 0
            }).catch(async (e) => {
                console.log('send fail', e);
                await createError(event, e, true);
                return;
            });
        if (receipt)
            console.log('send complete receipt.', receipt);
    } catch(e) {
        console.log(e);
    }
}

function subscribe(caver) {
    const klayBridgeContract = new caver.eth.Contract(bridgeAbi, klayBridge);
    // const toBlock = await caver.rpc.klay.getBlockNumber();
    // await klayBridgeContract.getPastEvents('allEvents', {fromBlock: 70219000, toBlock: caver.utils.hexToNumber(toBlock)}).then(async function (events) {
    //     console.log(events);
    // });
    klayBridgeContract.events.allEvents()
        .on('connected', function(subscriptionId){
            console.log('klayBridgeContract subscriptionId ===================> ', subscriptionId);
        })
        .on('data', async (event) => {
            console.log('=====>', event);
            if (event.event === 'XswapExactTokensForTokens' || event.event === 'XswapExactTokensForETH' ||
                event.event === 'XswapExactTokensForTokensSupportingFeeOnTransferTokens' ||
                event.event === 'XswapExactTokensForETHSupportingFeeOnTransferTokens' ||
                event.event === 'XswapExactTaalForTaal'
                ) {
                console.log('klaytn listener', event);
                await update(event, false);
            } else {
                await sendToEth(event);
            }
        })
        .on('error', console.error);
}

export async function listenKlaytn() {
    console.log('listenKlaytn');
    await selectKlaytnLastBlockNumber();
    // const ws = new Caver.providers.WebsocketProvider(process.env.KLAYTN_WS_NODE);
    // const caver = new Caver(ws);
    let web3 = new Web3(process.env.KLAYTN_WS_NODE);
    subscribe(web3);
    setInterval(async () => {
        const lastBlock = await web3.eth.getBlockNumber().catch((e) => {
            console.log('klaytn getBlockNumber error.', e);
            web3 = new Web3(process.env.KLAYTN_WS_NODE);
            subscribe(web3);
        });
        console.log('klaytn lastBlock : ', lastBlock);
        // await updateKlaytnLastBlockNumber(caver.utils.hexToNumber(lastBlock));
        if (lastBlock) {
            await updateKlaytnLastBlockNumber(lastBlock);
        }
    }, 10000);
}

export async function checkKlaytnBridge() {
    let web3 = new Web3(process.env.KLAYTN_NODE);
    const toBlock = await web3.eth.getBlockNumber();
    const klayBridgeContract = new web3.eth.Contract(bridgeAbi, klayBridge);

    await klayBridgeContract.getPastEvents('allEvents', {fromBlock: toBlock - 10 * 60, toBlock: toBlock})
        .then(async function (events) {
            for(let i = 0; i < events.length; i++) {
                if (events[i].event !== 'XswapExactTokensForTokens' && events[i].event !== 'XswapExactTokensForETH' &&
                    events[i].event !== 'XswapExactTokensForTokensSupportingFeeOnTransferTokens' &&
                    events[i].event !== 'XswapExactTokensForETHSupportingFeeOnTransferTokens'&&
                    events[i].event !== 'XswapExactTaalForTaal'
                ){
                    console.log('=====>', events[i].event, events[i].transactionHash);
                    const history = await models.SendHistory.findByTxHash(events[i].transactionHash);
                    if (!history) {
                        console.log('history not found.', events[i].transactionHash);
                        // need to execute transaction
                        await sendToEth(events[i]);
                    }
                }
            }
        });
}



