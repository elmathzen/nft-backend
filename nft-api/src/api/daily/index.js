import Router from 'koa-router';
import * as dailyCtrl from './daily.ctrl';

const daily = new Router();

daily.get('/', dailyCtrl.data);

export default daily;