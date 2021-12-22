import path from 'path';
import {checkKlaytnBridge} from "./klaytn2";
import {checkEthBridge} from "./ethereum2";

process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({path: path.join(__dirname, '../.env')});
} else if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({path: path.join(__dirname, '../.env.development')});
}

function main() {
    console.log('checker start.');
    checkKlaytnBridge();
    checkEthBridge();
    // setInterval(async () => {
    //     checkKlaytnBridge();
    // }, 60000);
}

main();