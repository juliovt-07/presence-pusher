const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1396595",
  key: "45967fe02c9c0a0ef871",
  secret: "08ca66ef000edee2b0ed",
  cluster: "us2",
  useTLS: true,
});
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.post("/pusher/auth", function (req, res) {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const nome = req.query.nome;
  const presenceData = {
    user_id: getRandomInt(1, 99999999),
    user_info: { nome: nome },
  };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});
const port = process.env.PORT || 5000;
app.listen(port);