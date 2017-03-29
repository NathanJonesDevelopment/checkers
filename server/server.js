var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var uuidV4 = require('uuid/v4');

var  app = express();
var server = http.createServer(app);
var io = socketIO.listen(server);

var games = {};

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/../build'));

app.get('/', function (req, res) {
	res.render('index');
});

app.get(['/node_modules*', '/lib*'], function(req, res) {
	res.sendFile(path.join(__dirname + '/..' + req.path));
});

app.get('/*.*', function(req, res) {
	var filePath = req.path.split('/game').pop();
	res.sendFile(path.join(__dirname + '/../build' + filePath));
});

app.get('/startGame', function(req, res) {
	var gameID = uuidV4();
	games[gameID] = [];
	res.send(gameID);
});

app.get('/game/:gameID', function(req, res) {
	res.render('game', req.params);
});

io.on('connection', function (socket) {
	socket.on('joinGame', function(gameID) {
		if (games[gameID]) {
			games[gameID].push(socket); //{socket, player: games[gameID].length + 1});

			socket.emit('assignPlayerColor', games[gameID].length === 1 ? 'red' : 'black');

			if (games[gameID].length === 2) {
				games[gameID].map(function(client) { 
					client.emit('playersReady');
				});
			}
		}
	});

	socket.on('sendMove', function(gameID, action) {
		if (games[gameID]) {
			games[gameID].filter(function(client) {
				return client.conn.id !== socket.conn.id
			}).map(function(client) {
				client.emit('opponentMoved', action);
			});
		}
	});

	socket.on('switchPlayer', (gameID) => {
		if (games[gameID]) {
			games[gameID].filter(function(client) {
				return client.conn.id !== socket.conn.id
			}).map(function(client) {
				client.emit('switchPlayer');
			});
		}
	});

	socket.on('endGame', function(gameID) {
		delete games[gameID];
	});
});

server.listen(process.env.PORT || 3000);