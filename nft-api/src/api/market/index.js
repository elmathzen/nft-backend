import Router from 'koa-router';
import * as marketCtrl from './market.ctrl';

const market = new Router();

market.get('/', marketCtrl.data);

export default market;