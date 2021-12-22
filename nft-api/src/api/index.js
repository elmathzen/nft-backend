import Router from 'koa-router';
import market from './market';

const api = new Router();

api.use('/tradeList', market.routes());

export default api;
