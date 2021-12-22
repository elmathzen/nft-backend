import Router from 'koa-router';
import * as ethPriceCtrl from './ethprice.ctrl';

const ethprice = new Router();

ethprice.get('/', ethPriceCtrl.getPrice);

export default ethprice;