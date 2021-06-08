const mongoose = require('mongoose');
const { Album } = require('./album')

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    artist: {
        type: Array,
        validate: {
            validator: (v) => {
                return v.length > 0
            }
        },
        message: 'Song must have atleast one artist'
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Album,
        required: true
    },
    genre: {
        type: String,
        enum: ['pop', 'melody', 'rock'],
        required: true
    }
})

const Song = mongoose.model('song', songSchema);

module.exports.Song = Song;