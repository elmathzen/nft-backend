import Router from 'koa-router';
import fee from './fee';
import history from './history';
import user from './user';

const bridge = new Router();

bridge.use('/fee', fee.routes());
bridge.use('/history', history.routes());
bridge.use('/user', user.routes());

export default bridge;
