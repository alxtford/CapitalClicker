
//https://github.com/cloudant/nodejs-cloudant

//import express.js
var express = require('express');
//assign it to variable app
var app = express();
//create a server and pass in app as a request handler
var serv = require('http').createServer(app); //Server-11

var Cloudant = require('cloudant');

var me = '511ca238-fccd-486b-b4a8-3441a50531bc-bluemix'; // Set this to your own account
var password = "84da1dc77eccb3f811f8218aad8178d1ba45fa462ab8751a49ba85b35efe1927";

// Initialize the library with my account.
var cloudant = Cloudant({account:me, password:password});

cloudant.db.list(function(err, allDbs) { console.log('All my databases: %s', allDbs.join(', '))});


//send a index.html file when a get request is fired to the given
//route, which is ‘/’ in this case
// app.get('/',function(req, res) {
// 	res.sendFile(__dirname + '/client/index.html');
// });
//this means when a get request is made to ‘/client’, put all the
//static files inside the client folder
//Under ‘/client’. See for more details below

app.use('/client',express.static(__dirname + '/client'));
app.use('/assets',express.static(__dirname + '/client/assets'));
app.use('/lib',express.static(__dirname + '/lib'));
//app.use('/socket.io',express.static(__dirname + '/node_modules/socket.io'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/client/index.html');
	});

//listen on port 2000
serv.listen(process.env.PORT || 2000);
console.log("Server started.");

process.on('exit', function() {
 console.log('Server is shutting down!');
});

function testEmit(){
  console.log("EMIT RECEIVED");
}


 // binds the serv object we created to socket.io
var io = require('socket.io')(serv);

// listen for a connection request from any client
io.sockets.on('connection', function(socket){
	console.log("socket connected");

  socket.on("testEmit", testEmit);

	//output a unique socket.id
	console.log(socket.id);
});
