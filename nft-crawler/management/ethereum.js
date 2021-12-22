// import {getKlaytnWeb3} from "./util/awskms";
// import {ethBridge, klayBridge, klayRouter, ethAddr, klayAddr} from "./util/constants";
// import {selectETHLastBlockNumber, updateETHLastBlockNumber} from "./util/lastBlockHandler";
// import {createHistory, update} from "./util/eventUtil";
// import {approve} from "./util/approveUtil";
//
// const Web3 = require('web3');
// const models = require('./models');
//
// const bridgeAbi = require('./abis/bridge.json');
// const erc20Abi =  require('./abis/erc20.json');
//
// async function sendToKlaytn(event) {
//     const result = event.returnValues;
//     console.log('sendToKlay');
//     try {
//         const history = await createHistory(event, true);
//         console.log('22222', history);
//     } catch (e) {
//         console.log(e);
//         return;
//     }
//     const web3 = getKlaytnWeb3();
//     const accounts = await web3.eth.getAccounts();
//     const token1 = new web3.eth.Contract(erc20Abi, result.pathx[0]);
//     // const tmp = await web3.eth.getBalance(accounts[0]);
//     // console.log('account', accounts[0], tmp);
//     await approve(klayRouter, token1, accounts[0]);
//     const token2 = new web3.eth.Contract(erc20Abi, result.pathx[result.pathx.length - 1]);
//     await approve(klayRouter, token2, accounts[0]);
//
//     const klayBridgeContract = new web3.eth.Contract(bridgeAbi, klayBridge);
//     try {
//         const deadline = new Date().getTime() + 10000;
//         let method;
//         const isETH = result.pathx[result.pathx.length - 1].toLowerCase() === ethAddr.toLowerCase()
//                     || result.pathx[result.pathx.length - 1].toLowerCase() === klayAddr.toLowerCase();
//         if (event.event === 'SwapExactETHForTokens' || event.event === 'SwapExactTokensForTokens'
//             || event.event === 'SwapExactTokensForTokensSupportingFeeOnTransferTokens'
//             || event.event === 'SwapExactETHForTokensSupportingFeeOnTransferTokens') {
//             console.log(result.amountIn, result.amountOutMin, result.to, result.pathx);
//             if (isETH) {
//                 console.log('xswapExactTokensForETH method call', isETH);
//                 method = klayBridgeContract.methods.xswapExactTokensForETH(result.amountIn, result.amountOutMin, result.pathx, result.to, deadline, event.transactionHash);
//             } else {
//                 console.log('xswapExactTokensForTokens method call', isETH);
//                 method = klayBridgeContract.methods.xswapExactTokensForTokens(result.amountIn, result.amountOutMin, result.pathx, result.to, deadline, event.transactionHash);
//             }
//         } else if (event.event === 'SwapETHForExactTokens' || event.event === 'SwapTokensForExactTokens') {
//             console.log('xswapTokensForExactTokens method call', isETH);
//             console.log(result.amountOut, result.amountInMax, result.to, result.pathx);
//             if (event.event === 'SwapTokensForExactTokens' && isETH) {
//                 method = klayBridgeContract.methods.xswapTokensForExactETH(result.amountOut, result.amountInMax, result.pathx, result.to, deadline, event.transactionHash);
//             } else {
//                 method = klayBridgeContract.methods.xswapTokensForExactTokens(result.amountOut, result.amountInMax, result.pathx, result.to, deadline, event.transactionHash);
//             }
//         } else if (event.event === 'SwapTokensForExactETH') {
//             console.log('xswapTokensForExactETH method call');
//             console.log(result.amountIn, result.amountOutMin, result.to, result.pathx);
//             method = klayBridgeContract.methods.xswapTokensForExactETH(result.amountIn, result.amountOutMin, result.pathx, result.to, deadline, event.transactionHash);
//         } else if (event.event === 'SwapExactTokensForETH' || event.event === 'SwapExactTokensForETHSupportingFeeOnTransferTokens') {
//             console.log('xswapExactTokensForETH method call');
//             console.log(result.amountOut, result.amountInMax, result.to, result.pathx);
//             method = klayBridgeContract.methods.xswapExactTokensForETH(result.amountOut, result.amountInMax, result.pathx, result.to, deadline, event.transactionHash);
//         }
//         const gasAmount = await method.estimateGas({from: accounts[0]});
//         // console.log('======>>>>', gasAmount);
//         const receipt = await method
//             .send({
//                 from: accounts[0],
//                 gas: gasAmount,
//                 value: 0
//             });
//         // const receipt = await klayRouterContract.methods.swapExactTokensForTokens('1000000000000000000', '776195074138339352', ['0x6C27d9F6C4067212797794CD931596C2917F7Bf7', '0xa76639d69cFDbff27abF1d0aBC22d5E30e73a07f'], '0xaDEDbF58aBF28A94ecC2efd44090B514d4b5D186', deadline)
//         // const receipt = await klayRouterContract.methods.swapExactTokensForTokens(result.amountIn, 0, result.pathx, result.to, deadline)
//         //     .send({
//         //         from: deployer.address,
//         //         gas: 1500000,
//         //         value: 0
//         //     });
//         console.log(receipt);
//         // history.xTxHash = receipt.transactionHash;
//         // history.xFrom = receipt.from;
//         // history.xTo = receipt.to;
//         // history.status = true;
//         //
//         // await history.save();
//     } catch(e) {
//         console.log(e);
//     }
// }
//
// async function subscribe(web3) {
//     const ethBridgeContract = new web3.eth.Contract(bridgeAbi, ethBridge);
//     const toBlock = await web3.eth.getBlockNumber();
//     console.log(toBlock);
//     // await ethBridgeContract
//     //     .getPastEvents('allEvents', {fromBlock: 11249091, toBlock: toBlock})
//     //     .then(async function (events) {
//     //         // console.log(events)
//     //         for(let i = 0; i < events.length; i++) {
//     //             // console.log('=====>', events[i]);
//     //             await sendToKlay(events[i]);
//     //         }
//     //     })
//     //     .catch((error) => {
//     //         console.log(error);
//     //     });
//
//     ethBridgeContract.events.allEvents()
//         .on('connected', function(subscriptionId){
//             console.log('ethBridgeContract subscriptionId ===================> ', subscriptionId);
//         })
//         .on('data', async (event) => {
//             console.log('=====>', event.event);
//             if (event.event === 'XswapExactTokensForTokens' || event.event === 'XswapExactTokensForETH') {
//                 console.log('ethereum listener', event);
//                 // update send history
//                 await update(event);
//             } else {
//                 await sendToKlaytn(event);
//             }
//         })
//         .on('error', console.error);
// }
//
// export async function listenEth() {
//     console.log('listenEth');
//     await selectETHLastBlockNumber();
//     let web3 = new Web3(process.env.ETH_WS_NODE);
//     subscribe(web3);
//
//     setInterval(async () => {
//         const lastBlock = await web3.eth.getBlockNumber().catch(() => {
//             web3 = new Web3(process.env.KLAYTN_WS_NODE);
//             subscribe(web3);
//         });
//         console.log('eth lastBlock : ', lastBlock);
//         if (lastBlock) {
//             await updateETHLastBlockNumber(lastBlock);
//         }
//     }, 10000);
// }
//
// export async function checkEthBridge() {
//     let web3 = new Web3(process.env.ETH_NODE);
//     const toBlock = await web3.eth.getBlockNumber();
//     const ethBridgeContract = new web3.eth.Contract(bridgeAbi, ethBridge);
//
//     await ethBridgeContract.getPastEvents('allEvents', {fromBlock: toBlock - 10 * 10, toBlock: toBlock})
//         .then(async function (events) {
//             for(let i = 0; i < events.length; i++) {
//                 if (events[i].event !== 'XswapExactTokensForTokens' && events[i].event !== 'XswapExactTokensForETH') {
//                     console.log('=====>', events[i].event, events[i].transactionHash);
//                     const history = await models.SendHistory.findByTxHash(events[i].transactionHash);
//                     if (!history) {
//                         console.log('history not found.', events[i].transactionHash);
//                         // need to execute transaction
//                         await sendToKlaytn(events[i]);
//                     }
//                 }
//             }
//         });
// }