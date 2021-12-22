import Router from 'koa-router';
import * as userCtrl from './user.ctrl';

const user = new Router();

user.get('/:address', userCtrl.getUserHistorys);

export default user;