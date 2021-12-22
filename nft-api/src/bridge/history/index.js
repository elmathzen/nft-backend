import Router from 'koa-router';
import * as historyCtrl from './history.ctrl';

const history = new Router();

history.get('/', historyCtrl.getData);
history.get('/:txHash', historyCtrl.getTransaction);

export default history;