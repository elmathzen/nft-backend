import {getEthPrice, getTopPairs, selectToken} from "../../lib/common";

export const getAllToken = async (ctx) => {
    const result = await getTopPairs(ctx);
    const ethPrice = await getEthPrice(ctx);

    const tokens = result.reduce((accumulator, pair) => {
        let liq = ethPrice * pair.base_totalLiquidity * pair.base_derivedETH;
        let price = pair.base_derivedETH * ethPrice;
        accumulator[pair.base_id] = {
            name: pair.base_name,
            address: pair.base_id,
            symbol: pair.base_symbol,
            price: price.toString(),
            price_ETH: pair.base_derivedETH,
            liquidity: liq.toString()
        };
        liq = ethPrice * pair.quote_totalLiquidity * pair.quote_derivedETH;
        price = pair.quote_derivedETH * ethPrice;
        accumulator[pair.quote_id] = {
            name: pair.quote_name,
            address: pair.quote_id,
            symbol: pair.quote_symbol,
            price: price.toString(),
            price_ETH: pair.quote_derivedETH,
            liquidity: liq.toString()
        };
        return accumulator;
    }, {});

    ctx.body =  { updated_at: new Date().getTime(), data: tokens};
};

export const getToken = async (ctx) => {
    // const result = await getTopPairs(ctx);
    const token = await selectToken(ctx);
    if (token == null){
        ctx.body =  { updated_at: new Date().getTime(), data: {}};
        return;
    }

    const ethPrice = await getEthPrice(ctx);
    let liq = ethPrice * token.totalLiquidity * token.derivedETH;
    let price = token.derivedETH * ethPrice;

    const retToken = {
        name: token.name,
        address: token.id,
        symbol: token.symbol,
        price: price.toString(),
        price_ETH: token.derivedETH,
        liquidity: liq.toString()
    };

    ctx.body =  { updated_at: new Date().getTime(), data: retToken};
};