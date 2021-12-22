import { klayMarket } from './util/constants'
import { updateKlaytnLastBlockNumber, selectKlaytnLastBlockNumber } from "./util/lastBlockHandler";
import { createTrade, updateTrade, deleteTrade } from "./util/eventUtil";

const Web3 = require('web3');
const models = require('./models');

const marketAbi = require('./abis/market.json');

async function subscribe(web3) {
    // const toBlock = await web3.eth.getBlockNumber();
    const klayMarketContract = new web3.eth.Contract(marketAbi, klayMarket);

    // await klayMarketContract.getPastEvents('allEvents', {fromBlock: 78419785, toBlock: toBlock})
    //     .then(async function (events) {
    //     for (const event of events) {
    //         if (event.event === 'Ask')
    //         {
    //             await createTrade(event);
    //         }
    //         else if(event.event === 'Trade')
    //         {
    //             await updateTrade(event);
    //         }
    //         else if (event.event === 'CancelSellToken')
    //         {
    //             await deleteTrade(event);
    //         }
    //     }
    //     });

    klayMarketContract.events.allEvents()
        .on('connected', function(subscriptionId){
            console.log('klayMarketContract subscriptionId ===================> ', subscriptionId);
        })
        .on('data', async (event) => {
            console.log('=====>', event);
            if (event.event === 'Ask')
            {
                await createTrade(event);
            }
            else if (event.event === 'Trade')
            {
                await updateTrade(event);
            }
            else if (event.event === 'CancelSellToken')
            {
                await deleteTrade(event);
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

export async function checkKlaytnMarket() {
    let web3 = new Web3(process.env.KLAYTN_NODE);
    const toBlock = await web3.eth.getBlockNumber();
    const klayMarketContract = new web3.eth.Contract(marketAbi, klayMarket);

    await klayMarketContract.getPastEvents('allEvents', {fromBlock: toBlock - 10 * 60, toBlock: toBlock})
        .then(async function (events) {
            for(let i = 0; i < events.length; i++) {
                if (events[i].event === 'Ask' ||
                    events[i].event === 'Trade' ||
                    events[i].event === 'CancelSellToken')
                {
                    console.log('=====>', events[i].event, events[i].transactionHash);
                    const trade = await models.NftTrades.findByTxHash(events[i].transactionHash);
                    if (!trade) {
                        console.log('trade history not found.', events[i].transactionHash);
                        // need to update database for missing transactions
                        if (events[i].event === 'Ask') {
                            await createTrade(events[i]);
                        } else if (events[i].event === 'Trade') {
                            await updateTrade(events[i]);
                        } else if (events[i].event === 'CancelSellToken') {
                            await deleteTrade(events[i]);
                        }
                    }
                }
            }
        });
}



