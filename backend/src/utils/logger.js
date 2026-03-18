const winston = require('winston');

// Cloud Run is simpler with structured JSON logs
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'travelmate-backend' },
    transports: [
        new winston.transports.Console()
    ]
});

module.exports = logger;
