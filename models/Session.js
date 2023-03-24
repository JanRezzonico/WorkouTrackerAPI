const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
    weight: {
        type: Number,
    },
    reps: {
        type: Number,
        integer: true
    },
    time: {
        type: Number,
        integer: true
    }
});

const exerciseSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String
    },
    sets: {
        type: [setSchema],
    }
});

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    exercises: {
        type: [exerciseSchema],
    }
})

module.exports = mongoose.model('Session', schema);