var express = require('express');
var Twit = require("twit");
var config = require("./config");
var path = require('path');

console.log("Starting...");

var app = express();
var T = new Twit(config);

var tweets = [];

var stream = T.stream('statuses/filter', { track: '#tradewar' });

stream.on('tweet', function (tweet) {
        console.log(tweet['created_at']);
	tweets.push({name:tweet['text'],
	time:tweet['created_at']});
  })

app.get('/', function (req, res) {
 	//res.sendFile(path.join(__dirname + '/index.html', {tweets:tweets})); 
  res.send(tweets); 
});



app.listen(3000, function () {
   console.log('Started listening on port 3000!');

});
