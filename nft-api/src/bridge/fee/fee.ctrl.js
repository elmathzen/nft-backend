export const getData = async (ctx) => {
    ctx.body = {
        "eth_fee": "3000000000000",
        "klay_fee": "60000000000000000000"
    };
};