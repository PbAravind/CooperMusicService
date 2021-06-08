const mongoose = require('mongoose');
const { User } = require('./user');
const { Album } = require('./album');

const userAlbumSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  album: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: Album,
    required: true
  }
})

const UserAlbum = mongoose.model('useralbum', userAlbumSchema);

module.exports.UserAlbum = UserAlbum;