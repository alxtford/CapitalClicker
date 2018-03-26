
//https://github.com/cloudant/nodejs-cloudant
//https://www.tonyerwin.com/2014/09/redirecting-http-to-https-with-nodejs.html


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
var cloudant = Cloudant({account:me, password:password, maxAttempt: 5, plugins: { retry: { retryErrors: true, retryStatusCodes: [ 429, 404 ] } } }, function(err, cloudant) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }});

  cloudant.db.list(function(err, allDbs) { console.log('All my databases: %s', allDbs.join(', '))});

  var db = cloudant.db.use("user_data");

  var update;

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
  serv.listen(process.env.PORT || process.env.VCAP_APP_PORT || 2000);

  // Enable reverse proxy support in Express. This causes the
  // the "X-Forwarded-Proto" header field to be trusted so its
  // value can be used to determine the protocol. See
  // http://expressjs.com/api#app-settings for more details.
  app.enable('trust proxy');

  // Add a handler to inspect the req.secure flag (see
  // http://expressjs.com/api#req.secure). This allows us
  // to know whether the request was via http or https.
  app.use (function (req, res, next) {
          if (req.secure) {
                  // request was via https, so do no special handling
                  next();
          } else {
                  // request was via http, so redirect to https
                  res.redirect('https://' + req.headers.host + req.url);
          }
  });

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

    //output a unique socket.id
    console.log(socket.id);

    // Test Socket Emits
    socket.on("testEmit", testEmit);

    // Listen for userName
    socket.on("saveName", function saveName(name){

      db.get(name, { include_docs: true }, function(err, body, data){
        if (err && err.statusCode == 404)
        {
          console.log("UNABLE TO FIND " + name +". CREATING...");
          db.copy("Default", name, { overwrite: false }, function(err, headers) {
            if (!err)
            { console.log("HEADER: " + headers);}

            db.get(name, function(err, body, data){
              if(err)
              {
                console.log("ERROR ON DOC GET\n" + err);
              }
              else {

                var date = new Date();
                // var dateInt = parseInt(date.getDate() + "" + (date.getMonth()+1) + "" + date.getFullYear());
                update = body;
                //console.log(body);
                update.dateCreated= date;
                update.dateLastLogin= date;

                db.insert(update, function(err, body, doc) {
                  if (err) {
                    console.log('Error inserting data\n' + err);
                    return 500;
                  }
                  console.log('UPDATED BOTH TIMES');
                  //console.log(body);
                  socket.emit("ready");
                  //socket.emit("userData", body);
                  return 200;
                });
              }
            });
          });

        }
        else {
          console.log(err);
          var date = new Date();
          update = body;
          update.dateLastLogin= date;
          db.insert(update, function(err, body, doc) {
            if (err) {
              console.log('Error inserting data on Login\n' + err);
              return 500;
            }
            console.log('UPDATED LAST LOGIN TIME');
            console.log(body);
            //socket.emit("userData", body);
            socket.emit("ready");
            return 200;
          });


        }
      });
      //doc.dateLastLogin
    });

    // Listen for user data update
    socket.on("userUpdate", function userUpdate(userData, name){
      var serverReceive = JSON.parse(userData);
      db.find({selector:{_id:  name}}, function(err, result){
        // console.log("PRINTING BODY FROM DOC:\n" + body);
        var dataUpdate = result.docs[0];
        //console.log("DATA UPDATE:\n" + JSON.stringify(dataUpdate));
        console.log("SERVER HAS RECEIVED, PARSED:\n" + JSON.stringify(serverReceive));
        if(dataUpdate != serverReceive)
        {
          dataUpdate = serverReceive;
          dataUpdate._rev = result.docs[0]._rev;
          console.log("SERVER HAS RECEIVED:\n" + JSON.stringify(dataUpdate));

          db.insert(dataUpdate, function(err, body, doc) {
            if (err) {
              console.log('Error inserting data on update\n' + err);
              console.log(doc + "\n" + JSON.stringify(dataUpdate));
              return 500;
            }
            // console.log('UPDATED SAVED USER DATA');
            // console.log("SAVED BODY:\n" + body);
            return 200;

          });
        }
      });
    });

    socket.on("demandUpdate", function demandUpdate(name)
    {
      console.log("NAME SUPPLIED: " + name);
      db.find({selector:{_id:  name}}, function(err, result){
        if(err)
        {
          console.log(err);
        }
        // else {
        //   body.rows.forEach(function(doc) {
        //     console.log(doc);
        //   });
        // }
        //console.log("DEMANDED DOC:\n" + JSON.stringify(result.docs[0]));
        socket.emit("userData", JSON.stringify(result.docs[0]));
      });

    });

  });
