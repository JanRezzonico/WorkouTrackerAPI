const express = require('express');
const winston = require('winston');
const sessionRouter = express.Router();
const Session = require('../models/Session.js');

const LOG = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}] ${info.message} [${info.logIp}]`)
      ),
    transports: [
        new winston.transports.File({
            filename: 'logs/session/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/session/warn.log',
            level: 'warn'
        }),
        new winston.transports.File({
            filename: 'logs/session/combined.log'
        }),
        new winston.transports.Console()
    ]
});

// Get all sessions
sessionRouter.get('/', async (req, res) => {
    LOG.info(`All session request received`);
    try {
        const sessions = await Session.find({});
        LOG.info(`Sent all sessions`);
        return res.json(sessions);
    } catch (err) {
        LOG.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get session by user id
sessionRouter.get('/:id', async (req, res) => {
    LOG.info(`Get session request received for ${req.params.id}`);
    try {
        const sessions = await Session.find({ user_id: req.params.id });
        LOG.info(`Sent session with user_id ${req.params.id}`);
        return res.json(sessions);
    } catch (err) {
        LOG.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Create new session
sessionRouter.post('/', async (req, res) => {
    LOG.info(`Post session request received`);
    try {
        const newSession = await Session.create(req.body);
        const session = new Session(newSession);
        await session.save();
        LOG.info(`Created session with id ${session._id}`);
        return res.status(201).json(session);
    } catch (err) {
        LOG.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = sessionRouter;
