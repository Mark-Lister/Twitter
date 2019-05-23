
var express = require('express');
var Twit = require("twit");
var config = require("./config");
const socket = require("socket.io");
var path = require('path');

console.log("Starting...");


var app = express();
app.set("view engine", "pug");


app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/index.html')); 
  //res.send(tweets); 
});

const server = app.listen(3000, function () {
   console.log('Started listening on port 3000!');
});



const io = socket.listen(server);
io.on("connection", client => {
  console.log("user connected");
  io.sockets.emit("chat", tweets);
  client.on("disconnect", () => {
    console.log("user disconnected");
  });
});


var T = new Twit(config);


var stream = T.stream('statuses/filter', { track: 'tradewar' });

let tweetsPerMin = {
  date: new Date,
  tweets: 0
};

var tweets = [];


stream.on('tweet', function (tweet) {
    tweetsPerMin.tweets = tweetsPerMin.tweets + 1;
  });

setInterval(function() {
  tweets.push({
      date: tweetsPerMin.date,
      tweets: tweetsPerMin.tweets
    });
    io.sockets.emit("chat", tweets);
    console.log('New time reseting count!');
    tweetsPerMin.date = new Date;
    tweetsPerMin.tweets = 0;
}, 3600000);