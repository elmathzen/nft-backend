import {getConn} from "../../lib/mysqlPool";
import logger from "../../lib/logger";

export const getData = async (ctx) => {
    let conn = await getConn(ctx);
    let query = 'SELECT totalLiquidityUSD FROM TaalFactory';
    let [result] = await conn.query(query);

    conn.release();
    logger.debug('tvl.getData ' + JSON.stringify(result[0]));
    ctx.body = { updated_at: new Date().getTime(), data: {tvl: result[0] == null ? 0 : result[0].totalLiquidityUSD }};
};