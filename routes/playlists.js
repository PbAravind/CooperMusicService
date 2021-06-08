const express = require('express');
const router = express.Router();
const { Playlist } = require('../models/playlist.js')

router.get("/:id", async (req, res) => {
  let userId = req.params.id;

  const playlists = await Playlist.find({ user: userId })

  //const result = await playlist.save();
  res.send(playlists);
})

router.post("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let userId = req.body.userId;
  let playlistName = req.body.playlistName;
  //let songs = req.body.songs

  const playlist = new Playlist({
    user: userId,
    name: playlistName,
    //songs
  })

  const result = await playlist.save();
  res.send(result);
})

router.put("/:id", async (req, res) => {
  let id = req.params.id;
  let songs = req.body.songs;

  const playlist = await Playlist.findByIdAndUpdate(id, {
    $set: {
      songs
    }
  },
    { new: true }
  )

  res.send(playlist)
})

module.exports = router;
