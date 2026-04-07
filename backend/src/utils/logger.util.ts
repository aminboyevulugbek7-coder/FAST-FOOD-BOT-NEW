import winston from 'winston';

/**
 * Winston logger konfiguratsiyasi
 * Log darajalari: error, warn, info, debug
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'fastfood-telegram-bot' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          if (Object.keys(meta).length > 0 && meta.service !== 'fastfood-telegram-bot') {
            msg += ` ${JSON.stringify(meta)}`;
          }
          return msg;
        })
      ),
    }),
    // File transport - error logs
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // File transport - combined logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

/**
 * Production muhitida debug loglarni o'chirish
 */
if (process.env.NODE_ENV === 'production') {
  logger.level = 'info';
}
