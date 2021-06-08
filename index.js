const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const userRouter = require('./routes/users')
const playlistRouter = require('./routes/playlists')
const { Song } = require('./models/song');
const { Album } = require('./models/album');
const { Plan } = require('./models/plan');
const { Subscription } = require('./models/subscription');
const { UserAlbum } = require('./models/userAlbum');
const { User } = require('./models/user');

mongoose.connect('mongodb://localhost/coopmusic')
  .then(() => { console.log("Connected to DB....") })

app.use(express.json());
app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/playlist", playlistRouter);

app.get("/api/albums", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  let albums = await Album.find();
  //fomrat img Buffer to base64 string
  let formattedAlbums = albums.map(v => {
    let obj = { ...v };
    obj._doc.img = (v.img && v.img.data) ? v.img.data.toString('base64') : null
    return obj._doc
  })
  res.send(formattedAlbums);
})

app.get("/api/songs/", async (req, res) => {
  const { sortBy, dir } = req.query;
  res.header("Access-Control-Allow-Origin", "*");

  const songs = await Song.find()
    .populate('album')
    .sort({ [sortBy]: dir === 'asc' ? 1 : -1 });

  //fomrat img Buffer to base64 string
  let formattedSongs = songs.map(v => {
    let obj = { ...v };
    let album = { ...v.album }
    obj._doc.album.img = (album.img && album.img.data) ? album.img.data.toString('base64') : null
    return obj._doc
  })

  res.send(formattedSongs);
})

app.post("/api/songs/:id", async (req, res) => {
  const { sortBy, dir } = req.query;
  res.header("Access-Control-Allow-Origin", "*");

  let isAlbum = req.body.isAlbum;
  //let isSong = req.body.isSong;
  let isPlaylist = req.body.isPlaylist;

  let filter = isAlbum ? { album: req.params.id }
    : isPlaylist ? { _id: { $in: req.params.id.split(",") } }
      : { _id: req.params.id }

  console.log("isAlbum", isAlbum, req, filter);

  const songs = await Song.find(filter)
    .populate('album')
    .sort({ [sortBy]: dir === 'asc' ? 1 : -1 });

  //fomrat img Buffer to base64 string
  let formattedSongs = songs.map(v => {
    let obj = { ...v };
    let album = { ...v.album }
    obj._doc.album.img = (album.img && album.img.data) ? album.img.data.toString('base64') : null
    return obj._doc
  })

  res.send(formattedSongs);
})

app.get("/api/plans", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const plans = await Plan.find();

  res.send(plans);
})

Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

app.post("/api/subscribe", async (req, res) => {
  let userId = req.body.userId;
  let plan = req.body.plan;
  let multiDeviceSupport = req.body.multiDevicePrice;
  let registeredDevice = req.body.loginDevice;
  const planInfo = await Plan.findOne({ plan });
  let date = new Date();
  const subscriptionEndDate = date.addDays(planInfo.period);
  console.log("subsc",subscriptionEndDate);

  const updateResult = await Subscription.updateMany({user: userId}, {
    $set: {
      isActive: false
    }
  })

  console.log("RES", updateResult);

  let subscription = new Subscription({
    user: userId,
    plan: planInfo._id,
    subscriptionStartDate: Date.now(),
    subscriptionEndDate,
    multiDeviceSupport,
    registeredDevice,
    isActive: true
  })

  const result = await subscription.save();
  res.send(result);
})

app.post("/api/purchaseAlbum", async (req, res) => {
  let userId = req.body.userId;
  let albumId = req.body.albumId;

  const userAlbums = await UserAlbum.findOne({ user: userId });

  if (userAlbums) {
    albumId = [...userAlbums.album, albumId]

    console.log("ALBUMID", albumId);

    //check Syntax
    const result = await UserAlbum.findOneAndUpdate({ user: userId }, {
      $set: {
        album: albumId
      }
    }, { new: true })

    console.log("RESULT", result);

    res.send(result);
  } else {
    const useralb = UserAlbum({
      user: userId,
      album: [ albumId ]
    })

    const result = await useralb.save();
    res.send(result);
  }

  
})

let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App running in port ${port}`)
})

// const createCollection = async () => {
//   const coll = new Song({
//     title: 'Runaway',
//     album: "60bb087b31935e35383827b1",
//     genre: "rock",
//     artist: ['Aurora']
//   })

//   const result = await coll.save();
//   console.log("RESULT", result);
// }

// // createCollection();

// const createAlbumImage = async () => {

//   let imgUrl = path.join(__dirname, '/RunningWithTheWolves.jpg');

//   console.log(imgUrl);

//   let data = fs.readFileSync(imgUrl);

//   let album = await Album.findOneAndUpdate({ name: 'Running with the wolves' }, {
//     $set: {
//       img: {
//         data,
//         contentType: 'image/png'
//       }
//     }
//   },
//     { new: true }
//   );

//   console.log("RESULT", album);
// }

// //createAlbumImage();