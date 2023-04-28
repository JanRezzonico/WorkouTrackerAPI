const express = require('express');
const winston = require('winston');
const User = require('../models/User.js');
const userRouter = express.Router();

const LOG = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}] ${info.message} [${info.logIp}]`)
      ),
    transports: [
        new winston.transports.File({
            filename: 'logs/user/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/user/warn.log',
            level: 'warn'
        }),
        new winston.transports.File({
            filename: 'logs/user/combined.log'
        }),
        new winston.transports.Console()
    ]
});

// Get all users
userRouter.get('/', async (req, res) => {
    LOG.info(`All users request received`);
    try {
        const users = await User.find({});
        LOG.info(`Sent all users`);
        return res.json(users);
    } catch (err) {
        LOG.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get user by id
userRouter.get('/:id', async (req, res) => {
    LOG.info(`Get user request received for ${req.params.id}`);
    try {
        const user = await User.findById(req.params.id);
        if (user) { // User found
            LOG.info(`Sent user ${user._id}`);
            return res.json(user);
        } else { // User not found
            LOG.warn(`User ${req.params.id} not found`);
            return res.status(404).json({ message: 'Not found' });
        }
    } catch (err) {
        LOG.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Update user by id
userRouter.put('/:id', async (req, res) => {
    LOG.info(`Put user request received for ${req.params.id}`);
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (user) { // User found and updated
            LOG.info(`Updated user ${user._id}`);
            return res.json(user);
        } else { // User not found
            LOG.warn(`User ${req.params.id} not found`);
            return res.status(404).json({ message: 'Not found' });
        }
    } catch (err) {
        LOG.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = userRouter;
