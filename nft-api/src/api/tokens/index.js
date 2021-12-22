import Router from 'koa-router';
import * as tokensCtrl from './tokens.ctrl';

const tokens = new Router();

tokens.get('/', tokensCtrl.getAllToken);
tokens.get('/:id', tokensCtrl.getToken);

export default tokens;