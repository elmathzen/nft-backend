import Router from 'koa-router';
import * as pairCtrl from './pair.ctrl';

const pair = new Router();

pair.get('/', pairCtrl.getPairs);

export default pair;