// API Config and App keys
const channel_name = "presence-channel"
const app_key = '45967fe02c9c0a0ef871'
const app_cluster = 'us2'
const authEndpoint = "http://192.168.254.167:5000/pusher/auth"

var url = new URL(window.location);
var nome = url.searchParams.get("nome") || "Usuário Anônimo";

const presence_pusher_key = localStorage.getItem("presence_pusher_key") || false

if (!presence_pusher_key) {
  localStorage.setItem("presence_pusher_key", uuidv4())
}

var authOptions = {
  params: {
    id: localStorage.getItem("presence_pusher_key") || uuidv4(),
    nome: nome
  }
};

var pusher = new Pusher(app_key, {
  cluster: app_cluster,
  forceTLS: true,
  authEndpoint: authEndpoint,
  auth: authOptions
});

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

var channel = pusher.subscribe(channel_name);

var onlines = []

channel.bind("pusher:subscription_succeeded", function () {
  channel.members.each(function (member) {
    onlines.push({ id: member.id, nome: member.info.nome })
  })
  var arr = onlines.filter((este, i) => onlines.indexOf(este) === i);
  onlines = arr
  setOnlines()
});

channel.bind("pusher:member_added", (member) => {
  onlines.push({ id: member.id, nome: member.info.nome })
  var arr = onlines.filter((este, i) => onlines.indexOf(este) === i);
  onlines = arr
  setOnlines()
});

channel.bind("pusher:member_removed", (member) => {
  var index = onlines.findIndex(user => user.id == member.id)
  if (index != -1) {
    onlines.splice(index, 1)
  }
  setOnlines()
});
