const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    first_name: {
        required: true,
        type: String
    },
    last_name: {
        required: true,
        type: String
    },
    birthday: {
        required: true,
        type: Date
    },
    height: {
        required: true,
        type: Number,
        integer: true
    },
    weight: {
        required: true,
        type: Number,
    },
})
module.exports = mongoose.model('User', schema);