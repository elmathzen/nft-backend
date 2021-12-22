// import {getEthWeb3} from "./util/awskms";
// import {ethBridge, klayBridge, ethRouter, ethAddr, klayAddr} from "./util/constants";
// import {updateKlaytnLastBlockNumber, selectKlaytnLastBlockNumber} from "./util/lastBlockHandler";
// import {approve} from "./util/approveUtil";
// import {createHistory, update} from "./util/eventUtil";
//
// const Web3 = require('web3');
// const models = require('./models');
//
// const bridgeAbi = require('./abis/bridge.json');
// const erc20Abi =  require('./abis/erc20.json');
//
// async function sendToEth(event) {
//     const result = event.returnValues;
//     console.log('sendToEth');
//     try{
//         const history = await createHistory(event, false);
//         console.log('11111', history);
//     } catch (e) {
//         console.log(e);
//         return;
//     }
//     const web3 = getEthWeb3();
//     // console.log('=====>', caver);
//     // const accounts = await caver.klay.getAccounts();
//     const accounts = await web3.eth.getAccounts();
//     const token1 = new web3.eth.Contract(erc20Abi, result.pathx[0]);
//     await approve(ethRouter, token1, accounts[0]);
//     const token2 = new web3.eth.Contract(erc20Abi, result.pathx[result.pathx.length - 1]);
//     await approve(ethRouter, token2, accounts[0]);
//     const ethBridgeContract = new web3.eth.Contract(bridgeAbi, ethBridge);
//     try {
//         const deadline = new Date().getTime() + 10000;
//         let method;
//         const isETH = result.pathx[result.pathx.length - 1].toLowerCase() === ethAddr.toLowerCase()
//             || result.pathx[result.pathx.length - 1].toLowerCase() === klayAddr.toLowerCase();
//         if (event.event === 'SwapExactETHForTokens' || event.event === 'SwapExactTokensForTokens'
//             || event.event === 'SwapExactTokensForTokensSupportingFeeOnTransferTokens'
//             || event.event === 'SwapExactETHForTokensSupportingFeeOnTransferTokens') {
//             console.log('xswapExactTokensForTokens method call');
//             console.log(result.amountIn, result.amountOutMin, result.to, result.pathx);
//             if (isETH) {
//                 method = ethBridgeContract.methods.xswapExactTokensForETH(result.amountIn, result.amountOutMin, result.pathx, result.to, deadline, event.transactionHash);
//             } else {
//                 method = ethBridgeContract.methods.xswapExactTokensForTokens(result.amountIn, result.amountOutMin, result.pathx, result.to, deadline, event.transactionHash);
//             }
//         } else if (event.event === 'SwapETHForExactTokens' || event.event === 'SwapTokensForExactTokens') {
//             console.log('xswapTokensForExactTokens method call');
//             console.log(result.amountOut, result.amountInMax, result.to, result.pathx);
//             if (event.event === 'SwapTokensForExactTokens' && isETH) {
//                 method = ethBridgeContract.methods.xswapTokensForExactETH(result.amountOut, result.amountInMax, result.pathx, result.to, deadline, event.transactionHash);
//             } else {
//                 method = ethBridgeContract.methods.xswapTokensForExactTokens(result.amountOut, result.amountInMax, result.pathx, result.to, deadline, event.transactionHash);
//             }
//         } else if (event.event === 'SwapTokensForExactETH') {
//             console.log('xswapTokensForExactETH method call');
//             console.log(result.amountIn, result.amountOutMin, result.to, result.pathx);
//             method = await ethBridgeContract.methods.xswapTokensForExactETH(result.amountIn, result.amountOutMin, result.pathx, result.to, deadline, event.transactionHash);
//         } else if (event.event === 'SwapExactTokensForETH' || event.event === 'SwapExactTokensForETHSupportingFeeOnTransferTokens') {
//             console.log('xswapExactTokensForETH method call');
//             console.log(result.amountOut, result.amountInMax, result.to, result.pathx);
//             method = await ethBridgeContract.methods.xswapExactTokensForETH(result.amountOut, result.amountInMax, result.pathx, result.to, deadline, event.transactionHash);
//         }
//         const gasAmount = await method.estimateGas({from: accounts[0]});
//         // console.log('======>>>>', gasAmount);
//         const receipt = await method
//             .send({
//                 from: accounts[0],
//                 gas: gasAmount,
//                 value: 0
//             });
//         console.log(receipt);
//     } catch(e) {
//         console.log(e);
//     }
// }
//
// function subscribe(caver) {
//     const klayBridgeContract = new caver.eth.Contract(bridgeAbi, klayBridge);
//     // const toBlock = await caver.rpc.klay.getBlockNumber();
//     // await klayBridgeContract.getPastEvents('allEvents', {fromBlock: 70219000, toBlock: caver.utils.hexToNumber(toBlock)}).then(async function (events) {
//     //     console.log(events);
//     // });
//     klayBridgeContract.events.allEvents()
//         .on('connected', function(subscriptionId){
//             console.log('klayBridgeContract subscriptionId ===================> ', subscriptionId);
//         })
//         .on('data', async (event) => {
//             console.log('=====>', event);
//             if (event.event === 'XswapExactTokensForTokens' || event.event === 'XswapExactTokensForETH') {
//                 console.log('klaytn listener', event);
//                 await update(event);
//             } else {
//                 await sendToEth(event);
//             }
//         })
//         .on('error', console.error);
// }
//
// export async function listenKlaytn() {
//     console.log('listenKlaytn');
//     await selectKlaytnLastBlockNumber();
//     // const ws = new Caver.providers.WebsocketProvider(process.env.KLAYTN_WS_NODE);
//     // const caver = new Caver(ws);
//     let web3 = new Web3(process.env.KLAYTN_WS_NODE);
//     subscribe(web3);
//     setInterval(async () => {
//         const lastBlock = await web3.eth.getBlockNumber().catch(() => {
//             web3 = new Web3(process.env.KLAYTN_WS_NODE);
//             subscribe(web3);
//         });
//         console.log('klaytn lastBlock : ', lastBlock);
//         // await updateKlaytnLastBlockNumber(caver.utils.hexToNumber(lastBlock));
//         if (lastBlock) {
//             await updateKlaytnLastBlockNumber(lastBlock);
//         }
//     }, 10000);
// }
//
// export async function checkKlaytnBridge() {
//     let web3 = new Web3(process.env.KLAYTN_NODE);
//     const toBlock = await web3.eth.getBlockNumber();
//     const klayBridgeContract = new web3.eth.Contract(bridgeAbi, klayBridge);
//
//     await klayBridgeContract.getPastEvents('allEvents', {fromBlock: toBlock - 10 * 60, toBlock: toBlock})
//         .then(async function (events) {
//             for(let i = 0; i < events.length; i++) {
//                 if (events[i].event !== 'XswapExactTokensForTokens' && events[i].event !== 'XswapExactTokensForETH'){
//                     console.log('=====>', events[i].event, events[i].transactionHash);
//                     const history = await models.SendHistory.findByTxHash(events[i].transactionHash);
//                     if (!history) {
//                         console.log('history not found.', events[i].transactionHash);
//                         // need to execute transaction
//                         await sendToEth(events[i]);
//                     }
//                 }
//             }
//         });
// }
//
//
//
