import {executeETH} from "./ethereum2";
import {executeKlaytn} from "./klaytn2";
import path from "path";

const models = require('./models');

process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({path: path.join(__dirname, '../.env')});
} else if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({path: path.join(__dirname, '../.env.development')});
}

async function main() {
    const txHash = process.argv.slice(2)[0];
    if (!txHash) {
        console.log('input txHash. ex) yarn start:execute 0xasdf12312~~');
        return;
    }
    const history = await models.SendHistory.findByTxHash(txHash);
    // console.log('history ====', history);
    if (history) {
        if (history.xTxHash) {
            console.log('already executed.', txHash, history.xTxHash);
        } else {
            console.log('execute txHash', txHash);
            if (history.fromChain === 'ETH') {
                // get ETH event and execute sendToKlaytn
                await executeETH(history);
            } else if (history.fromChain === 'Klaytn') {
                // get klay event and execute sendToETH
                await executeKlaytn(history);
            }
        }
    } else {
        console.log('txHash not exists', txHash);
    }
    process.exit();
}
main();