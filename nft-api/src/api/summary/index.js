import Router from 'koa-router';
import * as summaryCtrl from './summary.ctrl';

const summary = new Router();

summary.get('/', summaryCtrl.getData);

export default summary;