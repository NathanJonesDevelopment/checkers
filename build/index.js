/*
var static = require('node-static');
var file = new static.Server();
require('http').createServer(function(request, response) {
	request.addListener('end', function() {
		file.serve(request, response);
	}).resume();
}).listen(process.env.PORT || 3000);
*/

var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/build/index.html');
});

http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});