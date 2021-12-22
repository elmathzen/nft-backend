import {getBridgeConn} from "./mysqlPool";

export async function getAllHistory(ctx) {
    let conn = await getBridgeConn(ctx);
    const page = ctx.request.query.page ? ctx.request.query.page : 1;
    const pageSize = ctx.request.query.pageSize ? ctx.request.query.pageSize : 10;
    let query = `SELECT * FROM SendHistory ORDER BY createdAt DESC LIMIT ${page}, ${pageSize}`;

    let [result] = await conn.query(query);
    // console.log(result);
    conn.release();

    return result;
}

export async function getHistory(ctx) {
    let conn = await getBridgeConn(ctx);
    let query = `SELECT * FROM SendHistory WHERE txHash = '${ctx.params.txHash}' or xTxHash = '${ctx.params.txHash}' ORDER BY createdAt `;

    let [result] = await conn.query(query);
    console.log(query);
    console.log(result);
    conn.release();

    return result;
}

export async function getHistoryCount(ctx) {
    let conn = await getBridgeConn(ctx);
    let query = `SELECT count(*) as totCnt FROM SendHistory`;

    let [result] = await conn.query(query);
    console.log(result);
    conn.release();

    return result[0].totCnt;
}

export async function getUserHistory(ctx) {
    let conn = await getBridgeConn(ctx);
    let query = `SELECT * FROM SendHistory WHERE SendHistory.from = '${ctx.params.address}' and TIMESTAMPDIFF(HOUR, createdAt, now()) < 24
                ORDER BY createdAt`;
    console.log(query);
    let [result] = await conn.query(query);
    console.log(result);
    conn.release();

    return result;
}