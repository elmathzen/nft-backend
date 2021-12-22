require('dotenv').config();

import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
// import jwtMiddleware from './lib/jwtMiddleware';
// import serve from 'koa-static';
// import path from 'path';
// import send from 'koa-send';

const { PORT } = process.env;

import api from './api';

const morgan = require('koa-morgan');
// const models = require("./models/index.js");

// models.sequelize.sync().then( () => {
//   console.log(" DB 연결 성공");
// }).catch(err => {
//   console.log("연결 실패");
//   console.log(err);
// });

import {stream} from "./lib/logger";

const app = module.exports = new Koa();
const router = new Router();
function verifyOrigin ( ctx ) {
  const origin = ctx.headers.origin;
  if ( !originIsValid( origin )) return false;
  return origin;
}

function originIsValid ( origin ) {
  return validOrigins.indexOf( origin ) != -1;
}
const validOrigins = ['http://localhost:3000'];
let corsOptions = {
  origin: verifyOrigin,
  credentials: true,
};

app.proxy = true;
app.use(cors(corsOptions));

router.use('/market/api', api.routes());
router.use('/market/beta/api', api.routes());

app.use(morgan('combined', { stream }));

// app.use(morgan('combined', { stream: require('file-stream-rotator').getStream({
//     filename: path.resolve(__dirname, '../log/access.log.%DATE%'),
//     frequency: 'daily',
//     verbose: false,
//     date_format: 'YYYY-MM-DD'
//   })
// }));

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening to port %d', port);
});
