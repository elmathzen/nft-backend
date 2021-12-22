import {getKlaytnWeb3} from "./util/awskms";
import { ethBridge, klayBridge, ethAddr, klayAddr, talAddr, ktalAddr } from './util/constants'
import {selectETHLastBlockNumber, updateETHLastBlockNumber} from "./util/lastBlockHandler";
import {createHistory, update, createError} from "./util/eventUtil";
// import {approve} from "./util/approveUtil";

const Web3 = require('web3');
const models = require('./models');

const bridgeAbi = require('./abis/bridge.json');
// const erc20Abi =  require('./abis/erc20.json');

export async function executeETH(history) {
    let web3 = new Web3(process.env.ETH_NODE);
    const ethBridgeContract = new web3.eth.Contract(bridgeAbi, ethBridge);

    await ethBridgeContract.getPastEvents('allEvents', {fromBlock: history.blockNumber, toBlock: history.blockNumber})
        .then(async function (events) {
            for(let i = 0; i < events.length; i++) {
                console.log(events[i].transactionHash, history.txHash, events[i].transactionHash === history.txHash);
                if (events[i].transactionHash === history.txHash) {
                    if (events[i].event !== 'XswapExactTokensForTokens' && events[i].event !== 'XswapExactTokensForETH' &&
                        events[i].event !== 'XswapExactTokensForTokensSupportingFeeOnTransferTokens' &&
                        events[i].event !== 'XswapExactTokensForETHSupportingFeeOnTransferTokens' &&
                        events[i].event !== 'XswapExactTaalForTaal'
                    ){
                        await sendToKlaytn(events[i], true);
                        console.log('resending transaction complete.', events[i].event, events[i].transactionHash);
                    }
                } else {
                    console.log('resending transaction not found.', events[i]);
                }
            }
        });
}

export async function sendToKlaytn(event, isManual) {
    const result = event.returnValues;
    console.log('sendToKlay');
    if (!isManual) {
        try {
            const history = await createHistory(event, true);
            console.log('22222', history);
        } catch (e) {
            console.log(e);
            return;
        }
    }

    const web3 = getKlaytnWeb3();
    const accounts = await web3.eth.getAccounts();
    // const token1 = new web3.eth.Contract(erc20Abi, result.pathx[0]);
    const tmp = await web3.eth.getBalance(accounts[0]);
    console.log('account klay balance = ', accounts[0], tmp);
    // await approve(klayRouter, token1, accounts[0]);
    // const token2 = new web3.eth.Contract(erc20Abi, result.pathx[result.pathx.length - 1]);
    // await approve(klayRouter, token2, accounts[0]);

    const klayBridgeContract = new web3.eth.Contract(bridgeAbi, klayBridge);
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
                method = klayBridgeContract.methods.xswapExactTaalForTaal(
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
                    // console.log('xswapExactTokensForETH method call');
                    // method = klayBridgeContract.methods.xswapExactTokensForETH(
                    //     result.amountIn,
                    //     result.amountOutMin,
                    //     result.pathx,
                    //     result.to,
                    //     deadline,
                    //     event.transactionHash
                    // );
                    console.log('xswapExactTxswapExactTokensForETHSupportingFeeOnTransferTokensokensForETH method call');
                    method = klayBridgeContract.methods.xswapExactTokensForETHSupportingFeeOnTransferTokens(
                        result.amountIn,
                        result.amountOutMin,
                        result.pathx,
                        result.to,
                        deadline,
                        event.transactionHash
                    );
                } else {
                    // 아래 순서로 estimate gas에서 에러가 없는 것 실행... 어떻게 ?
                    // console.log('xswapExactTokensForTokens method call');
                    // method = klayBridgeContract.methods.xswapExactTokensForTokens(
                    //     result.amountIn,
                    //     result.amountOutMin,
                    //     result.pathx,
                    //     result.to,
                    //     deadline,
                    //     event.transactionHash
                    // );
                    console.log('xswapExactTokensForTokensSupportingFeeOnTransferTokens method call');
                    method = klayBridgeContract.methods.xswapExactTokensForTokensSupportingFeeOnTransferTokens(
                        result.amountIn,
                        result.amountOutMin,
                        result.pathx,
                        result.to,
                        deadline,
                        event.transactionHash
                    );
                }
            }
        }
        else if (event.event === 'SwapExactETHForTokens' || event.event === 'SwapExactTokensForTokens')
        {
            console.log(result.amountIn, result.amountOutMin, result.to, result.pathx);
            console.log('xswapExactTokensForTokens method call');

            method = klayBridgeContract.methods.xswapExactTokensForTokens(
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
            console.log(result.amountIn, result.amountOutMin, result.to, result.pathx);
            console.log('xswapExactTokensForTokensSupportingFeeOnTransferTokens method call');

            method = klayBridgeContract.methods.xswapExactTokensForTokensSupportingFeeOnTransferTokens(
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

            method = klayBridgeContract.methods.xswapExactTokensForETH(
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
            console.log('SwapExactTokensForETHSupportingFeeOnTransferTokens method call');
            console.log(result.amountOut, result.amountInMax, result.to, result.pathx);

            method = klayBridgeContract.methods.xswapExactTokensForETHSupportingFeeOnTransferTokens(
                result.amountIn,
                result.amountOutMin,
                result.pathx,
                result.to,
                deadline,
                event.transactionHash
            );
        }

        console.log('estimateGas start.');
        const gasAmount = await method.estimateGas({from: accounts[0]}).catch(async (e) => {
            console.log('estimateGas fail.', e);
            await createError(event, e, true);
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
            });
        // const receipt = await klayRouterContract.methods.swapExactTokensForTokens('1000000000000000000', '776195074138339352', ['0x6C27d9F6C4067212797794CD931596C2917F7Bf7', '0xa76639d69cFDbff27abF1d0aBC22d5E30e73a07f'], '0xaDEDbF58aBF28A94ecC2efd44090B514d4b5D186', deadline)
        // const receipt = await klayRouterContract.methods.swapExactTokensForTokens(result.amountIn, 0, result.pathx, result.to, deadline)
        //     .send({
        //         from: deployer.address,
        //         gas: 1500000,
        //         value: 0
        //     });
        if (receipt)
            console.log('send complete receipt.', receipt);
        // history.xTxHash = receipt.transactionHash;
        // history.xFrom = receipt.from;
        // history.xTo = receipt.to;
        // history.status = true;
        //
        // await history.save();
    } catch(e) {
        console.log(e);
    }
}

async function subscribe(web3) {
    const ethBridgeContract = new web3.eth.Contract(bridgeAbi, ethBridge);
    // const toBlock = await web3.eth.getBlockNumber();
    // console.log(toBlock);
    // await ethBridgeContract
    //     .getPastEvents('allEvents', {fromBlock: 11249091, toBlock: toBlock})
    //     .then(async function (events) {
    //         // console.log(events)
    //         for(let i = 0; i < events.length; i++) {
    //             // console.log('=====>', events[i]);
    //             await sendToKlay(events[i]);
    //         }
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });

    ethBridgeContract.events.allEvents()
        .on('connected', function(subscriptionId){
            console.log('ethBridgeContract subscriptionId ===================> ', subscriptionId);
        })
        .on('data', async (event) => {
            console.log('=====>', event.event);
            if (event.event === 'XswapExactTokensForTokens' || event.event === 'XswapExactTokensForETH' ||
                event.event === 'XswapExactTokensForTokensSupportingFeeOnTransferTokens' ||
                event.event === 'XswapExactTokensForETHSupportingFeeOnTransferTokens' ||
                event.event === 'XswapExactTaalForTaal'
            ) {
                console.log('ethereum listener', event);
                // update send history
                await update(event, true);
            } else {
                await sendToKlaytn(event);
            }
        })
        .on('error', console.error);
}

export async function listenEth() {
    console.log('listenEth');
    await selectETHLastBlockNumber();
    let web3 = new Web3(process.env.ETH_WS_NODE);
    subscribe(web3);

    setInterval(async () => {
        const lastBlock = await web3.eth.getBlockNumber().catch(() => {
            web3 = new Web3(process.env.ETH_WS_NODE);
            subscribe(web3);
        });
        console.log('eth lastBlock : ', lastBlock);
        if (lastBlock) {
            await updateETHLastBlockNumber(lastBlock);
        }
    }, 10000);
}

export async function checkEthBridge() {
    let web3 = new Web3(process.env.ETH_NODE);
    const toBlock = await web3.eth.getBlockNumber();
    const ethBridgeContract = new web3.eth.Contract(bridgeAbi, ethBridge);

    await ethBridgeContract.getPastEvents('allEvents', {fromBlock: toBlock - 5 * 10, toBlock: toBlock})
        .then(async function (events) {
            for(let i = 0; i < events.length; i++) {
                if (events[i].event !== 'XswapExactTokensForTokens' && events[i].event !== 'XswapExactTokensForETH' &&
                    events[i].event !== 'XswapExactTokensForTokensSupportingFeeOnTransferTokens' &&
                    events[i].event !== 'XswapExactTokensForETHSupportingFeeOnTransferTokens' &&
                    events[i].event !== 'XswapExactTaalForTaal'
                ){
                    console.log('=====>', events[i].event, events[i].transactionHash);
                    const history = await models.SendHistory.findByTxHash(events[i].transactionHash);
                    if (!history) {
                        console.log('history not found.', events[i].transactionHash);
                        // need to execute transaction
                        await sendToKlaytn(events[i]);
                    }
                }
            }
        });
}
