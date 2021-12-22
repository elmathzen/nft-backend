const ethers = require('ethers');
const Web3 = require('web3');

const { Contract } = ethers;
const web3 = new Web3(`https://ropsten.infura.io/v3/adb9c847d7114ee7bf83995e8f22e098`);

const bscAbi = require('./binancd.json');
let privateKey =    '0x9878867d5b480bc37e9c2e72745c3c22cc71289afbcaef176a095d8a0ed72291';
const sender =      '0x1716C4d49E9D81c17608CD9a45b1023ac9DF6c73';

// Common Constants
const binance =     97;
const ercToken =    '0xf6F8AcdBc60ED4FcB2510068d0769c6979f975f5';   // TALK
const name =        'Talken TP';
const symbol =      'TP';

// Constants for Binance
const bscBridge =           '0xF136490E7C1739Ce5540AeF3d6c8b92FB6B8462B';
const bepToken =            '';  // KTALK
const bscTransitAmount =    1000000000000000000000000;
const bscMintAmount =       1000000000000000000000000;
const bscBurnAmount =       1000000000000000000000000;
const bscTransitId =        'Talken-00005'

// Binance Methods

let overridesBsc = {
    gasLimit: 2300000,
    gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
    // value: ethers.utils.parseEther("0.0")
};

const sigKBscTransit = async () => {

    const hash = web3.utils.soliditySha3(
        binance,
        bscBridge,
        ercToken,
        ethers.BigNumber.from(bscTransitAmount),
        sender,
        bscTransitId
    );
    console.log('hash : ', hash);

    const sig = web3.eth.accounts.sign(hash, privateKey);
    console.log('sig  : ', sig);

    return sig;
}

const transitBsc = async () => {

    let provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-2-s3.binance.org:8545/');
    let wallet = new ethers.Wallet(privateKey, provider);

    let contract = new Contract(bscBridge, bscAbi, provider);
    let contractWithSigner = contract.connect(wallet);

    await sigKBscTransit().then((sig) => {
        console.log(sig);
    })

    try {
        let transaction = await contractWithSigner.transit(ercToken, name, symbol, klayTransitAmount.toString(), bscTransitId, sig, overridesBsc);
        const receipt = await transaction.wait();
        console.log(receipt);
    } catch (e) {
        console.log(e);
    }
}

const paybackBsc = async () => {

    let provider = new ethers.providers.JsonRpcProvider('https://api.baobab.klaytn.net:8651');
    let wallet = new ethers.Wallet(privateKey, provider);

    let contract = new Contract(bscBridge, bscAbi, provider);
    let contractWithSigner = contract.connect(wallet);

    try {
        let transaction = await contractWithSigner.payback(kipToken, bscBurnAmount.toString(), overridesBsc);
        const receipt = await transaction.wait();
        console.log(receipt);
    } catch (e) {
        console.log(e);
    }
}

transitBsc();
paybackBsc();


