import mysql from 'mysql2/promise';
import dbConf from '../../dbconfig-cypress.json';

const mysqlPool = mysql.createPool(dbConf);

export const getConnection = async (callback) => {
  await mysqlPool.getConnection(function (err, conn) {
    if(!err) {
      callback(conn);
    }
  });
}

export default mysqlPool;

