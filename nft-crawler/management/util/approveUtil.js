const ethers = require('ethers');

export const approve = async function (routerAddr, token, account) {
    console.log('approve start.');
    const allowance = await token.methods.allowance(routerAddr, account).send(
        {
            from: account
        }
    ).catch((e) => {console.log(e)});
    console.log('allowance = ', allowance);

    if (allowance.value === '0x0') {
        const amount = ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        const gasAmount = await token.methods.approve(routerAddr, amount.toString()).estimateGas({from: account});
        console.log('======>>>>', gasAmount);
        const rcpt1 = await token.methods.approve(routerAddr, amount.toString()).send({
            from: account,
            gas: gasAmount,
            value: 0
        }).catch((e) => {console.log(e)});
        console.log('token approved.', token, rcpt1);
    }
}