import logger from "../../lib/logger";
import {getEthPrice} from "../../lib/common";

export const getPrice = async (ctx) => {
    const price = await getEthPrice(ctx);
    ctx.body = { updated_at: new Date().getTime(), data: {ethPrice: price}};
    logger.debug('getPrice : ' + JSON.stringify(ctx.body));
};