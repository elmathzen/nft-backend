import {getEthWeb3, getKlaytnWeb3} from "./awskms";

const erc20Abi = require('../abis/erc20.json');

export async function fetchTokenName(address, isETH) {
    const web3 = isETH ? getEthWeb3() : getKlaytnWeb3();
    const contract = new web3.eth.Contract(erc20Abi, address);

    let name = 'unknown';
    try {
        name = await contract.methods.name().call();
    }catch (e) {
        console.log(e);
    }

    return name;
}

export async function fetchTokenSymbol(address, isETH) {
    const web3 = isETH ? getEthWeb3() : getKlaytnWeb3();
    const contract = new web3.eth.Contract(erc20Abi, address);

    let symbol = 'unknown';
    try {
        symbol = await contract.methods.symbol().call();
    }catch (e) {
        console.log(e);
    }

    return symbol;
}

export async function fetchTokenDecimals(address, isETH) {
    const web3 = isETH ? getEthWeb3() : getKlaytnWeb3();
    const contract = new web3.eth.Contract(erc20Abi, address);

    let decimals = null;
    try {
        decimals = await contract.methods.decimals().call();
    }catch (e) {
        console.log(e);
    }

    return decimals;
}
