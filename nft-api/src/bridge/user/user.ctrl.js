import {getUserHistory} from "../../lib/bridge";

export const getUserHistorys = async (ctx) => {
    const result = await getUserHistory(ctx);
    ctx.body = { updated_at: new Date().getTime(), data: result }
}
