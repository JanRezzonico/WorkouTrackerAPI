const express = require('express');
const winston = require('winston');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

const LOG = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}] ${info.message} [${info.ip}]`)
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs/auth/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/auth/warn.log',
            level: 'warn'
        }),
        new winston.transports.File({
            filename: 'logs/auth/combined.log'
        }),
        new winston.transports.Console()
    ]
});

// Route for user registration
authRouter.post('/register', async (req, res) => {
    LOG.info(`Registration request received for ${req.body.username}`);
    try {
        // Get the user input from the request body
        const { username, password } = req.body;

        // Check if the required fields are present
        if (!username || !password) {
            LOG.warn(`Missing fields in registration request`);
            return res.status(400).json({ error: 'Missing fields' });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            LOG.warn(`Username ${username} already exists`);
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Generate a salt and hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with the hashed password
        const newModel = {...req.body};
        newModel.password = hashedPassword;
        const newUser = await User.create(newModel);
        LOG.info(`New user ${newUser.username} registered`);

        // Send a response indicating success
        res.status(200).json({ _id: newUser._id });
    } catch (err) {
        LOG.error(`Error in user registration: ${err.message}`);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route for user login
authRouter.post('/login', async (req, res) => {
    LOG.info(`Login request received for ${req.body.username}`);
    try {
        // Get the user input from the request body
        const { username, password } = req.body;

        // Check if the required fields are present
        if (!username || !password) {
            LOG.warn(`Missing fields in login request`);
            return res.status(400).json({ error: 'Missing fields' });
        }

        // Find the user in the database
        const user = await User.findOne({ username: username });
        if (!user) {
            LOG.warn(`User ${username} not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            LOG.warn(`Invalid password for user ${username}`);
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Passwords match - send a success response
        LOG.info(`User ${username} logged in successfully`);
        res.status(200).json({ message: 'Login successful', _id: user._id });
    } catch (err) {
        LOG.error(`Error in user login: ${err.message}`);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = authRouter;
