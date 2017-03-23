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




/*
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
*/



/*
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var path = require('path');
 
app.use(express.static(path.join(__dirname + '/../build')));
 
app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log('server recieved: ' + msg);
  });
  console.log('new socket');
});
 
app.listen(process.env.PORT || 3000);
*/


/*
var express = require('express')
var http = require('http');
var socket = require('socket.io');
var path = require('path');

var app = express();
var server = http.Server(app);
var io = socket(http)

app.use(express.static(path.join(__dirname + '/../build')));

io.on('connection', function(socket){
  console.log('a user connected');
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});
*/



/*
var socket = require('socket.io-client')('http://localhost');
socket.on('connect', function(socket) {
	console.log('a user connected');
});
socket.on('event', function(data){});
socket.on('disconnect', function(){});
*/




var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname + '/../build')));

server.listen(process.env.PORT || 3000);