import Router from 'koa-router';
import * as feeCtrl from './fee.ctrl';

const fee = new Router();

fee.get('/', feeCtrl.getData);

export default fee;