/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/random.text', function (req, res) {
	res.send('random.text');
});

app.get('/get', function(req, res) {
	var cmd = req.query.line;
	console.log(cmd);
});

app.post('/test-post', function(req, res) {
	var host = req.body.host;
	var port = req.body.port;
	var username = req.body.username;
	var password = req.body.password;

	var Client = require('ssh2').Client;

	var conn = new Client();
	conn.on('ready', function() {
		console.log('Client :: ready');
		conn.exec('ls', function(err, stream) {
			if (err) throw err;
			stream.on('close', function(code, signal) {
				console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
				conn.end();
			}).on('data', function(data) {
				res.send(data);
				console.log('STDOUT: ' + data);
			}).stderr.on('data', function(data) {
				console.log('STDERR: ' + data);
			});
		});
	}).connect({
		host: host,
		port: port,
		username: username,
		password: password
	});
});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
	console.log("server starting on " + appEnv.url);
});
