import path from 'path';
import {checkKlaytnBridge, listenKlaytn} from "./klaytn2";
import {listenEth} from "./ethereum2";

process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({path: path.join(__dirname, '../.env')});
} else if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({path: path.join(__dirname, '../.env.development')});
}

function main() {
    listenKlaytn();
    listenEth();
    // checkKlaytnBridge();
    // setInterval(async () => {
    //     checkKlaytnBridge();
    // }, 60000);
}

main();
