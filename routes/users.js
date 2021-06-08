const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { Subscription } = require('../models/subscription');
const { Playlist } = require('../models/playlist');
const { UserAlbum } = require('../models/userAlbum');

router.post("/signup", async (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let address = req.body.address;
  let encryptedPwd;

  const user = await User.findOne({ email });

  if (user) return res.status(400).send('User already Exists');

  bcrypt.hash(password, 10, async function (err, hash) {
    // Store hash in your password DB.
    encryptedPwd = hash;
    let newUser = new User({
      username,
      email,
      password: encryptedPwd,
      address
    })

    const result = await newUser.save();
    res.send(result);
  });
})

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let loginDevice = req.body.loginDevice;

  const user = await User.findOne({ username });

  const verify = await bcrypt.compare(password, user.password);

  if (verify) {
    const token = jwt.sign({ name: username }, 'COOP_MUSIC');
    res.header("AUTH-TOKEN", token);
    const userInfo = {};
    userInfo.userId = user._id;
    const subscription = await Subscription.findOne({ user: user._id, isActive: true });
    userInfo.subscription = subscription;
    const playlist = await Playlist.find({ user: user._id });
    userInfo.playlists = playlist;
    const album = await UserAlbum.find({ user: user.id });
    userInfo.albums = album[0].album;
    userInfo.loginDevice = loginDevice;
    res.send(userInfo);
  } else {
    res.status(400).send('Incorrect Password');
  }
})

module.exports = router;