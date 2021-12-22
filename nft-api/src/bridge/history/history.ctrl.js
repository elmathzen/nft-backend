import {getAllHistory, getHistoryCount, getHistory} from "../../lib/bridge";

export const getData = async (ctx) => {
    const result = await getAllHistory(ctx);
    const count = await getHistoryCount(ctx);

    ctx.body =  { updated_at: new Date().getTime(), totalCount: count, data: result };
};

export const getTransaction = async (ctx) => {
    const result = await getHistory(ctx);

    ctx.body =  { updated_at: new Date().getTime(), data: result };
};
