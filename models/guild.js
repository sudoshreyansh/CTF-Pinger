const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    clubRole: String,
    newsChannel: String,
    categoryChannel: String,
    ctfs: [Number]
});

module.exports = mongoose.model('Guild', schema);