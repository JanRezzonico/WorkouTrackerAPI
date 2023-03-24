const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    birthday: {
        type: Date
    },
    height: {
        type: Number,
        integer: true
    },
    weight: {
        type: Number,
    },
})
module.exports = mongoose.model('User', schema);