import Router from 'koa-router';
import * as tvlCtrl from './tvl.ctrl';

const tvl = new Router();

tvl.get('/', tvlCtrl.getData);

export default tvl;