const mongoose = require('mongoose');
const { Song } = require('./song')

const playlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxLength: 50
  },
  songs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: Song
    //validate Empty Array
  }
})

const Playlist = mongoose.model('playlist', playlistSchema);

module.exports.Playlist = Playlist;