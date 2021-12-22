import {getConn} from "./mysqlPool";
import {BLACKLIST} from "./blacklist";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";

const TIME_BAOBAB_ADD = 1561564861;
const TIME_CYPRESS_ADD = 1561722807;

export async function getEthPrice(ctx) {
    let conn = await getConn(ctx);
    let query = 'SELECT * FROM Bundle';
    let [result] = await conn.query(query);
    conn.release();

    return result[0].ethPrice;
}

export async function selectToken(ctx) {
    let conn = await getConn(ctx);
    let query = `SELECT * FROM Token WHERE id = '${ctx.params.id}'`;
    let [result] = await conn.query(query);
    conn.release();
    if (result.length > 0)
        return result[0];
    else
        return null;
}

export async function getTopPairs(ctx) {
    const utcCurrentTime = dayjs(new Date());
    const utcOneDayBack = utcCurrentTime.subtract(1, "day").startOf('minute').unix();
    let firstBlock = utcOneDayBack - TIME_CYPRESS_ADD;

    if (ctx.request.url.indexOf('baobab') > 0)
        firstBlock = utcOneDayBack - TIME_BAOBAB_ADD;

    if (!firstBlock) {
        throw new Error("Failed to fetch blocks from the subgraph");
    }

    let conn = await getConn(ctx);
    let query = `SELECT a.id, a.reserve0, a.reserve1, a.volumeToken0, a.volumeToken1, a.reserveETH, a.reserveUSD, IFNull(a.volumeUSD, 0) as volumeUSD
                       , b.id as base_id, b.name as base_name, b.symbol as base_symbol, b.decimals as base_decimals
                       , b.derivedETH as base_derivedETH, b.derivedUSD as base_derivedUSD, b.totalLiquidity as base_totalLiquidity
                       , c.id as quote_id, c.name as quote_name, c.symbol as quote_symbol, c.decimals as quote_decimals
                       , c.derivedETH as quote_derivedETH, c.derivedUSD as quote_derivedUSD, c.totalLiquidity as quote_totalLiquidity
                FROM Pair a, Token b, Token c
                WHERE a.token0 = b.id and a.token1 = c.id 
                    and a.token0 not in (${BLACKLIST.join(',')}) and a.token1 not in (${BLACKLIST.join(',')})
                ORDER BY reserveUSD DESC
                LIMIT 1000`;
    let [result] = await conn.query(query);

    let query2 = `SELECT A.id, A.volumeToken0, A.volumeToken1, IFNull(A.volumeUSD, 0) as volumeUSD FROM PairHistory A,
                    (SELECT id, max(block) as block 
                       FROM PairHistory
                      WHERE id in (${result.map((pair) => JSON.stringify(pair.id)).join(',')})
                      and block <= ${firstBlock} group by id
                    ORDER BY id DESC) B 
                   WHERE A.id = B.id AND A.block = B.block`
    let [result2] = await conn.query(query2);

    const yesterdayVolumeIndex = await result2.reduce((memo, pair) => {
        memo[pair.id] = {
            volumeToken0: pair.volumeToken0,
            volumeToken1: pair.volumeToken1,
            volumeUSD: pair.volumeUSD
        }
        return memo;
    }, {});

    conn.release();
    const ret = result.map(
        (pair) => {
            let yesterday = yesterdayVolumeIndex[pair.id];
            if (yesterday == undefined)
                yesterday = {};

            return {
                ...pair,
                price:
                    pair.reserve0 !== 0 && pair.reserve1 !== 0
                        ? new BigNumber(pair.reserve1).dividedBy(pair.reserve0).toString()
                        : "0",
                previous24hVolumeToken0:
                    pair.volumeToken0 && yesterday.volumeToken0
                        ? new BigNumber(pair.volumeToken0).minus(yesterday.volumeToken0).toString()
                        : new BigNumber(pair.volumeToken0).toString(),
                previous24hVolumeToken1:
                    pair.volumeToken1 && yesterday.volumeToken1
                        ? new BigNumber(pair.volumeToken1).minus(yesterday.volumeToken1).toString()
                        : new BigNumber(pair.volumeToken1).toString(),
                previous24hVolumeUSD:
                    pair.volumeUSD && yesterday.volumeUSD
                        ? new BigNumber(pair.volumeUSD).minus(yesterday.volumeUSD).toString()
                        : new BigNumber(pair.volumeUSD).toString()
            };
        }
    ) || [];
    return ret;

}

export async function getOneDayTransactionCnt(ctx) {
    let conn = await getConn(ctx);
    let query = 'SELECT totalTransactions FROM TaalDayData ORDER BY date DESC LIMIT 3';
    let [result] = await conn.query(query);
    conn.release();

    if (result.length === 0) {
        return 0;
    } else if (result.length < 3) {
        return result[0].totalTransactions;
    } else {
        return result[0].totalTransactions - result[2].totalTransactions;
    }
}

export async function getOneDayVolumeUSD(ctx) {
    let conn = await getConn(ctx);
    let query = 'SELECT dailyVolumeUSD FROM TaalDayData ORDER BY date DESC LIMIT 2';
    let [result] = await conn.query(query);
    conn.release();
    if (result.length === 0)
        return "0";
    else if (result.length < 2)
        return result[0].dailyVolumeUSD;
    else {
        const seconUSD = new BigNumber(result[1].dailyVolumeUSD);
        return new BigNumber(result[0].dailyVolumeUSD).plus(seconUSD).toString();
    }
}