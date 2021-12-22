const ethers = require('ethers');
const Web3 = require('web3');
const Caver = require('caver-js')

const { Contract } = ethers;
const web3 = new Web3(`https://ropsten.infura.io/v3/adb9c847d7114ee7bf83995e8f22e098`);

const ethAbi = require('./abis/ethereum.json');
const klayAbi = require('./abis/klaytn.json');
const bscAbi = require('./binancd.json');

let privateKey = '0x9878867d5b480bc37e9c2e72745c3c22cc71289afbcaef176a095d8a0ed72291';

// Common Constants
const ethereum = 3;
const binance = 97;
const klaytn = 1001;

const sender =          '0x1716C4d49E9D81c17608CD9a45b1023ac9DF6c73';

// Constants for Ethereum
const ethBridge =     '0xF136490E7C1739Ce5540AeF3d6c8b92FB6B8462B';
const ercToken =        '0xf6F8AcdBc60ED4FcB2510068d0769c6979f975f5';   // TALK
const name =            'Talken TP';
const symbol =          'TP';
const ethWithdrawAmount =  10000000000000000000;
const ethTransitAmount =   1000000000000000000000000;
const ethWithdrawId =      'TAL-00002'

// Constants for Binance
const bscBridge =     '0xF136490E7C1739Ce5540AeF3d6c8b92FB6B8462B';
const bepToken =        '';  // KTALK
const bscTransitAmount =   1000000000000000000000000;
const bscMintAmount =      1000000000000000000000000;
const bscBurnAmount =      1000000000000000000000000;
const bscTransitId =       'Talken-00005'

// Constants for Klaytn
const klayBridge =    '0xFB9B3De0EF98A8BFF9C79E4bDd7094DC880A89b9';
const kipToken =        '';  // KTALK
const klayTransitAmount =    '1000000000000000000000000';    // 백만개
const klayMintAmount =      1000000000000000000000000;
const klayBurnAmount =      1000000000000000000000000;
const klayTransitId =       'Talken-00005'

// Ethereum Methods

const sigWithdraw = async () => {
    const hash = web3.utils.soliditySha3(
        ethereum,
        ethBridge,
        ercToken,
        ethWithdrawAmount.toString(),
        sender,
        ethWithdrawId
    );
    console.log('hash : ', hash);

    const sig = web3.eth.accounts.sign(hash, privateKey);
    console.log('sig  : ', sig.signature);
    return sig.signature;
}

let overridesEther = {
    gasLimit: 2300000,
    gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
};

const withdraw = async () => {

    let provider = new ethers.providers.InfuraProvider('ropsten','adb9c847d7114ee7bf83995e8f22e098');
    let wallet = new ethers.Wallet(privateKey, provider);

    let contract = new Contract(ethBridge, ethAbi, provider);
    let contractWithSigner = contract.connect(wallet);

    const sig = sigWithdraw();

    try {
        let transaction = await contractWithSigner.withdraw(sig, ethWithdrawId, ercToken, ethWithdrawAmount.toString(), overridesEther);
        const receipt = await transaction.wait();
        console.log(receipt);
    } catch (e) {
        console.log(e);
    }
}

const transitEther = async () => {

    // let provider = ethers.getDefaultProvider('ropsten');
    let provider = new ethers.providers.InfuraProvider('ropsten','adb9c847d7114ee7bf83995e8f22e098');
    let wallet = new ethers.Wallet(privateKey, provider);

    // let contractAddress = '0xF136490E7C1739Ce5540AeF3d6c8b92FB6B8462B';
    let contract = new Contract(ethBridge, ethAbi, provider);
    let contractWithSigner = contract.connect(wallet);

    try {
        let transaction = await contractWithSigner.transit(ercToken, ethTransitAmount.toString(), overridesEther);
        const receipt = await transaction.wait();
        console.log(receipt);
    } catch (e) {
        console.log(e);
    }
}

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

// Klaytn Methods

const sigKlayTransit = async () => {

    const hash = web3.utils.soliditySha3(
        klaytn,
        klayBridge,
        ercToken,
        ethers.BigNumber.from(klayTransitAmount),
        sender,
        klayTransitId
    );
    console.log('hash : ', hash);

    const sig = web3.eth.accounts.sign(hash, privateKey);
    console.log('sig  : ', sig);

    return sig;
}

const transitKlay = async () => {

    const caver = new Caver('https://api.baobab.klaytn.net:8651/')
    const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey)
    caver.wallet.add(deployer)

    await sigKlayTransit().then(async (sig) => {
        const { v, r, s } = sig;
        const vv = web3.utils.hexToNumber(v);

        const bridge = new caver.contract(klayAbi, klayBridge)

        try {
            const receipt = await bridge.methods.transit(
                ercToken, name, symbol, klayTransitAmount.toString(), klayTransitId, vv, r, s
            ).send({
                from: deployer.address,
                gas: 1500000,
                value: 0
            })
            console.log(receipt)
        } catch(error) {
            console.log(error)
        }
    })
}

const paybackKlay = async () => {

    const caver = new Caver('https://api.baobab.klaytn.net:8651/')
    const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey)
    caver.wallet.add(deployer)

    const bridge = new caver.contract(klayAbi, klayBridge);

    try {
        const receipt = await bridge.methods.payback(
            kipToken, klayBurnAmount.toString()
        ).send({
            from: deployer.address,
            gas: 1500000,
            value: 0
        })
        console.log(receipt)
    } catch(error) {
        console.log(error)
    }
}

// withdraw();
transitKlay();


