/*
var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');

app.use(express.static(path.join(__dirname + '/../build')));

app.get('/startGame', function(req, res) {
	res.json({id: 'randomId', socket: 'new websocket()'})
})

server.listen(process.env.PORT || 3000, function(){
	console.log(`listening on port: ${process.env.PORT || '3000'}`);
});




var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server});

wss.on('connection', function(ws) {
	console.log(`websocket connection on port: ${process.env.PORT || '3000'}`);
	ws.on('message', function(message) {
		console.log('Socket received: %s', message);
	});
	ws.send(message);
});
*/


var express = require('express');
var http = require('http');
var url = require('url');
var WebSocket = require('ws');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname + '/../build')));

var server = http.createServer(app);
var wss = new WebSocket.Server({server: server});

wss.on('connection', function connection(ws) {
	console.log('Server recieved new client connection!')
	var location = url.parse(ws.upgradeReq.url, true);
	// You might use location.query.access_token to authenticate or share sessions
	// or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

	ws.on('message', function incoming(message) {
		console.log('Socket received: %s', message);
	});

	ws.send('New connection!');
});

server.listen(process.env.PORT || 3000, function listening() {
	console.log('Listening on %d', server.address().port);
});