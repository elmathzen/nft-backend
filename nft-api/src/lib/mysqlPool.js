import cypressPool from "./mysqlPool-cypress";
import baobabPool from "./mysqlPool-baobab";
import bridgeBetaPool from "./mysqlPool-bridge";
import bridgePool from "./mysqlPool-bridge";

export const getConn = async (ctx) => {
  let conn;
  if (ctx.request.url.indexOf('baobab') > 0)
    conn = await baobabPool.getConnection(async conn => conn);
  else
    conn = await cypressPool.getConnection(async conn => conn);
  return conn;
}

export const getBridgeConn = async (ctx) => {
  let conn;
  if (ctx.request.url.indexOf('beta') > 0)
    conn = await bridgeBetaPool.getConnection(async conn => conn);
  else
    conn = await bridgePool.getConnection(async conn => conn);
  return conn;
}

export default getConn;