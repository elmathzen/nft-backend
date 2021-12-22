import mysqlPool from "../../lib/mysqlPool";
import logger from "../../lib/logger";
import {getOneDayTransactionCnt, getOneDayVolumeUSD} from "../../lib/common";

export const data = async (ctx) => {
    const txCnt = await getOneDayTransactionCnt(ctx);
    const volumeUSD = await getOneDayVolumeUSD(ctx);
    ctx.body = { updated_at: new Date().getTime(), data: {transactions: txCnt, volumeUSD: volumeUSD }};
};