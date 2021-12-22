import Router from 'koa-router';
import pairs from './pairs';
import tokens from './tokens';
import tvl from './tvl';
import daily from './daily';
import summary from './summary';
import ethprice from './ethprice';

const api = new Router();

api.use('/pairs', pairs.routes());
api.use('/tokens', tokens.routes());
api.use('/tvl', tvl.routes());
api.use('/daily', daily.routes());
api.use('/summary', summary.routes());
api.use('/ethprice', ethprice.routes());


export default api;
