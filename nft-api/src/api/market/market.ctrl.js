import {getBridgeConn} from "../../lib/mysqlPool";

async function getTrades(ctx) {
    let conn = await getBridgeConn(ctx);
    const page = ctx.request.query.page ? ctx.request.query.page : 0;
    const pageSize = ctx.request.query.pageSize ? ctx.request.query.pageSize : 10;
    let query = `SELECT * FROM NftTrades WHERE onSale = true ORDER BY createdAt DESC LIMIT ${page}, ${pageSize}`;

    let [result] = await conn.query(query);
    // console.log(result);
    conn.release();

    return result;
}

export async function getTradeCount(ctx) {
    let conn = await getBridgeConn(ctx);
    let query = `SELECT count(*) as totCnt FROM NftTrades WHERE onSale = true `;

    let [result] = await conn.query(query);
    console.log(result);
    conn.release();

    return result[0].totCnt;
}

export const data = async (ctx) => {
    const trades = await getTrades(ctx);
    const count = await getTradeCount(ctx);
    ctx.body = { updated_at: new Date().getTime(), totalCount: count, data: trades};
};