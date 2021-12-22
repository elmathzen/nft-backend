import winston from "winston";
import moment from 'moment-timezone';
require("winston-daily-rotate-file");
require("date-utils");

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
moment.tz.setDefault('Asia/Seoul');
const appendTimestamp = format((info, opts) => {
  if(opts.tz)
    info.timestamp = moment().format();
  return info;
});

//logger 설정
const logger = winston.createLogger({
  format: combine(
      label({ label: 'taalswap-restapi' }),
      appendTimestamp({ tz: 'Asia/Seoul' }),
      myFormat
  ),
  level: "debug", // 최소 레벨
  // 파일저장
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "log/system.log", // log 폴더에 system.log 이름으로 저장
      zippedArchive: true, // 압축여부
    })
  ],
});

//logger 설정
const accessLogger = winston.createLogger({
  format: combine(
      label({ label: 'taalswap-restapi' }),
      appendTimestamp({ tz: 'Asia/Seoul' }),
      myFormat
  ),
  level: "debug", // 최소 레벨
  // 파일저장
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "log/access.log", // log 폴더에 system.log 이름으로 저장
      zippedArchive: true, // 압축여부
    })
  ],
});

export const stream = {
  write: message => {
    accessLogger.info(message);
  }
}

export default logger;