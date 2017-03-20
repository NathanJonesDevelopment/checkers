var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

//app.use(express.static(__dirname + '/build'))

if (__dirname.slice(-6) === '/build') { // For production
	app.use(express.static(__dirname))
} else { // For development
	app.use(express.static(__dirname + '/build'))
}

http.listen(process.env.PORT || 3000, function(){
	console.log(`listening on port: ${process.env.PORT || '3000'}`);
});
