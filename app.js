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

var HashTable = require('hashtable');
var hashtable = new HashTable();

app.get('/random.text', function (req, res) {
	res.send('random.text');
});

function handleData(data) {
	console.log('STDOUT: ' + data);
}

app.get('/get', function(req, res) {

	var user = req.query.user;

	var cmd = req.query.line;

	var conn = hashtable.get(user);

	var output = "";

	
	conn.shell(function(err, stream) {

		if (err) throw err;

		stream.on('close', function() {
			console.log('Stream :: close');
				//conn.end();
			}).on('data', function(data) {
				console.log('STDOUT: ' + data);
				output = output + data;
			}).stderr.on('data', function(data) {
				console.log('STDERR: ' + data);
			});
			stream.write(cmd+'\n');
		});

	setTimeout(function() {

		res.send(output);

	}, 500);
	console.log("output is " + output);

	console.log(user);
});

app.post('/test-post', function(req, res) {
	var host = req.body.host;
	var port = req.body.port;
	var username = req.body.username;
	var password = req.body.password;
	var user = req.body.user;

	var Client = require('ssh2').Client;

	var conn = new Client();
	conn.connect({
		host: host,
		port: port,
		username: username,
		password: password
	});
	hashtable.put(user, conn);

});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
// app.listen(appEnv.port, '0.0.0.0', function() {

// 	// print a message when the server starts listening
// 	console.log("server starting on " + appEnv.url);
// });


var server = require('http').Server(app);

var io = require('socket.io')(server);

var term = require('term.js');

var ssh = require('ssh2');

server.listen(appEnv.port);
app.use(express.static(__dirname + '/public'));
app.use(term.middleware());
app.post('/connect', function(req, res) {
	var host = req.body.host;
	var port = req.body.port;
	var username = req.body.username;
	var password = req.body.password;
	var name = req.body.googleName;
	var email = req.body.googleEmail;
	console.log( 'req.user=' + name + " " + email );
	updateDatabase( email, name, host, port, username, password );
	if( username ) {
		var connection = io.on('connection', function (socket) {

			var conn = new ssh();

			socket.on('data', function(data) {
				console.log(data);
			});
			conn.on('keyboard-interactive', function(name, instr, lang, prompts, cb) {
				cb([password]);
			});
			conn.on('error', function(err) {
				console.log(err);
			}); 
			conn.on('ready', function() {
				console.log("connect again");
				socket.emit('data', '\n*** SSH CONNECTION ESTABLISHED ***\n');
				conn.shell(function(err, stream) {
					socket.on('data', function(data) {
						stream.write(data);
					})
					stream.on('close', function() {
						console.log('Stream :: close');
						conn.end();
					}).on('data', function(data) {
					//console.log('STDOUT: ' + data);
					socket.emit('data', data.toString('binary'));
				}).stderr.on('data', function(data) {
					console.log('STDERR: ' + data);
				});
			});
			}).on('close', function() {
				socket.emit('data', '\n*** SSH CONNECTION CLOSED ***\n');
				socket.emit('discon', 'end');
				connection.removeAllListeners('connection');
			}).connect({
				host: host,
				port: port,
				username: username,
				password: password,
				tryKeyboard: true
			});
		});
	res.send("connectted");
	}
});

/* ElephantSQL */
var pg = require('pg');
/* or native libpq bindings */
/* var pg = require('pg').native */

var conString = process.env.ELEPHANTSQL_URL || "postgres://nouhpzho:kxh5OnjhtkIG_bpoOhkjIlDtTat6_vIK@pellefant.db.elephantsql.com:5432/nouhpzho";

var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
    client.end();
  });
});

function getConnections( email ) {
	var conString = process.env.ELEPHANTSQL_URL || "postgres://nouhpzho:kxh5OnjhtkIG_bpoOhkjIlDtTat6_vIK@pellefant.db.elephantsql.com:5432/nouhpzho";

	var client = new pg.Client(conString);
	var connections;
	// /* get current number of connections */
	client.connect(function(err) {
  		if(err) {
    		return console.error('could not connect to postgres', err);
  		}
  		/* SELECT CONNECTIONS FROM "users" WHERE EMAIL LIKE 'calebandrewb@gmail.com' */
  		var request = 'SELECT CONNECTIONS FROM "users" WHERE EMAIL LIKE \'' + email + '\'';
  		console.log( "request=" + request );
  		client.query(request, function(err, result) {
    		if(err) {
      			return console.error('error running query', err);
    		}
    		console.log(result.rows[0].connections);
    		connections = result.rows[0].connections;
    		client.end();
  		});
	});
	return connections;
}

/* update the database appropriately */
function updateDatabase( email, name, host, port, username, passwords ) {
	var connections = 0;
	var entryExists;
	console.log( 'to insert elephant:' );
	console.log( 'email=' + email );
	console.log( 'name=' + name );

	var conString = process.env.ELEPHANTSQL_URL || "postgres://nouhpzho:kxh5OnjhtkIG_bpoOhkjIlDtTat6_vIK@pellefant.db.elephantsql.com:5432/nouhpzho";

	var client = new pg.Client(conString);
	// /* get current number of connections */
	// client.connect(function(err) {
 //  		if(err) {
 //    		return console.error('could not connect to postgres', err);
 //  		}
 //  		/* SELECT CONNECTIONS FROM "users" WHERE EMAIL LIKE 'calebandrewb@gmail.com' */
 //  		var request = 'SELECT CONNECTIONS FROM "users" WHERE EMAIL LIKE \'' + email + '\'';
 //  		console.log( "request=" + request );
 //  		client.query(request, function(err, result) {
 //    		if(err) {
 //      			return console.error('error running query', err);
 //    		}
 //    		connections = result.rows[0].connections;
 //    		client.end();
 //  		});
	// });

	conString = process.env.ELEPHANTSQL_URL || "postgres://nouhpzho:kxh5OnjhtkIG_bpoOhkjIlDtTat6_vIK@pellefant.db.elephantsql.com:5432/nouhpzho";

	client = new pg.Client(conString);

	client.connect(function(err) {
  		if(err) {
    		return console.error('could not connect to postgres', err);
  		}
  		var request = 'SELECT EXISTS(SELECT CONNECTIONS FROM "users" WHERE EMAIL LIKE \'' + email + '\')';
  		console.log( "request=" + request );
  		client.query(request, function(err, result) {
    		if(err) {
      			return console.error('error running query', err);
    		}
    		entryExists = result.rows[0].exists;

    		if( !entryExists ) {
    			/* user doesn't exist, so add them */
    			addUser( email, name, connections );
    		}
    		client.end();
  		});
	});
}

/* add user to users table */
function addUser( email, name, connections ) {
	conString = process.env.ELEPHANTSQL_URL || "postgres://nouhpzho:kxh5OnjhtkIG_bpoOhkjIlDtTat6_vIK@pellefant.db.elephantsql.com:5432/nouhpzho";

	client = new pg.Client(conString);

	/* add user */
	client.connect(function(err) {
  		if(err) {
    		return console.error('could not connect to postgres', err);
  		}
  		var request = 'INSERT INTO USERS VALUES (\'' + email + '\', \'' + name + '\', ' + connections + ');';
  		console.log( "request=" + request );
  		client.query(request, function(err, result) {
    		if(err) {
      			return console.error('error running query', err);
    		}
    		console.log(result);
    		client.end();
  		});
	});
}
