import {getTopPairs} from "../../lib/common";

export const getData = async (ctx) => {
    const result = await getTopPairs(ctx);
    const pairs = result.reduce((accumulator, pair) => {
        accumulator[`${pair.base_id}_${pair.quote_id}`] = {
            price: pair.price,
            base_volume: pair.volumeToken0,
            quote_volume: pair.volumeToken1,
            liquidity: pair.reserveUSD,
            liquidity_ETH: pair.reserveETH
        };

        return accumulator;
    }, {});


    ctx.body = { updated_at: new Date().getTime(), data: pairs};
};