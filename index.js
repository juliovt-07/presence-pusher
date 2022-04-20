const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Pusher = require("pusher");
require('dotenv/config');
const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER,
  useTLS: true,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post("/pusher/auth", function (req, res) {
  console.log(req.body)
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const presenceData = {
    user_id: req.body.id,
    user_info: { nome: req.body.nome },
  };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

const port = process.env.SERVER_PORT || 5000;
app.listen(port);