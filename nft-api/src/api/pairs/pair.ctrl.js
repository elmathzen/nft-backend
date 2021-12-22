import {getTopPairs} from "../../lib/common";

export const getPairs = async (ctx) => {
    let result = await getTopPairs(ctx);

    const pairs = result.reduce((accumulator, pair) => {
        accumulator[`${pair.base_id}_${pair.quote_id}`] = {
            pair_address: pair.id,
            reserve0: pair.reserve0,
            reserve1: pair.reserve1,
            base_name: pair.base_name,
            base_symbol: pair.base_symbol,
            base_decimals: pair.base_decimals,
            base_price: pair.base_derivedUSD,
            base_address: pair.base_id,
            quote_name: pair.quote_name,
            quote_symbol: pair.quote_symbol,
            quote_decimals: pair.quote_decimals,
            quote_price: pair.quote_derivedUSD,
            quote_address: pair.quote_id,
            liquidity: pair.reserveUSD,
            liquidity_ETH: pair.reserveETH,
            price: pair.price,
            base_volume: pair.previous24hVolumeToken0,
            quote_volume: pair.previous24hVolumeToken1,
            previous24hVolumeUSD: pair.previous24hVolumeUSD
        };

        return accumulator;
    }, {});
    ctx.body = { updated_at: new Date().getTime(), data: pairs};
};