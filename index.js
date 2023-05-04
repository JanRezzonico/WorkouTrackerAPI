require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const authRouter = require('./routes/authRouter');
const sessionRouter = require('./routes/sessionRouter');
const userRouter = require('./routes/userRouter');
const winston = require('winston');
const PORT = 3000;

const addIpToLogMeta = (req, res, next) => {
    req.loggerMeta = { ip: req.ip };
    next();
};
const LOG = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}] ${info.message} [${info.ip}]`)
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs/system/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/system/warn.log',
            level: 'warn'
        }),
        new winston.transports.File({
            filename: 'logs/system/combined.log'
        }),
        new winston.transports.Console()
    ]
});

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    LOG.error(error);
})

database.once('connected', () => {
    LOG.info('Database Connected');
})


const app = express();

app.use(addIpToLogMeta);
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/session', sessionRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    LOG.info(`Server Started at ${PORT}`);
})