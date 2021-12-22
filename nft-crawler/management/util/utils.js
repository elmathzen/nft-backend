import BigNumber from "bignumber.js";
import Web3 from "web3";

const ZERO_BI = Web3.utils.toNumber(0);
export function convertTokenToDecimal(tokenAmount, exchangeDecimals) {
    if (exchangeDecimals == ZERO_BI) {
        return new BigNumber(tokenAmount);
    }
    const amount = new BigNumber(tokenAmount);
    const dec = new BigNumber(10).pow(exchangeDecimals);
    return amount.div(dec);
}

export async function getFormattedAmount(tokenAmount) {
    const decimal = 18;
    const formattedAmount = convertTokenToDecimal(tokenAmount, decimal);

    return formattedAmount.toNumber();
}
