const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    artist: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        // max: Date.now() //add validation to get current year 
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        set: (val) => Math.round(val),
        get: (val) => Math.round(val)
    },
    img: {
      data: Buffer, 
      contentType: String
    }
})

const Album = mongoose.model('album', albumSchema);

module.exports.Album = Album;