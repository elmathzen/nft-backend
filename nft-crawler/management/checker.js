import path from 'path';
import {checkKlaytnMarket} from "./klaytn";

process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({path: path.join(__dirname, '../.env')});
} else if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({path: path.join(__dirname, '../.env.development')});
}

function main() {
    console.log('market checker start.');
    checkKlaytnMarket();
    // setInterval(async () => {
    //     checkKlaytnMarket();
    // }, 60000);
}

main();